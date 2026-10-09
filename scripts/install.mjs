#!/usr/bin/env node
/**
 * Install skills from this repository with the `npx skills` CLI.
 *
 * Usage:
 *   node scripts/install.mjs                  show help
 *   node scripts/install.mjs --all            install every skill
 *   node scripts/install.mjs <skill> [...]    install the named skill(s)
 *   node scripts/install.mjs --list           list available skills
 *   node scripts/install.mjs --dry-run        print commands, run nothing
 *   node scripts/install.mjs --agent <name>   install to a specific agent
 *   node scripts/install.mjs --repo <url>     override the repository URL
 *
 * Contract (see AGENTS.md > Script Requirements):
 *   - progress and errors   -> stderr
 *   - machine-readable JSON -> stdout
 */

import {spawn} from "node:child_process";
import {readdir, stat} from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {fileURLToPath} from "node:url";

const DEFAULT_REPO = "https://github.com/saneci/ai-agent-skills";
const REPO = process.env.SKILLS_REPO_URL || DEFAULT_REPO;
const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const SKILLS_DIR = path.join(ROOT, "skills");
const IS_WINDOWS = process.platform === "win32";

function status(message) {
    process.stderr.write(`${message}\n`);
}

function emit(result) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

function parseArgs(argv) {
    const opts = {skills: [], repo: REPO, list: false, all: false, dryRun: false, help: false, agent: null, yes: false, global: false, extra: []};
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === "--") {
            opts.extra = argv.slice(i + 1);
            break;
        }
        if (arg === "--list") opts.list = true;
        else if (arg === "--all") opts.all = true;
        else if (arg === "--dry-run") opts.dryRun = true;
        else if (arg === "--yes" || arg === "-y") opts.yes = true;
        else if (arg === "--global" || arg === "-g") opts.global = true;
        else if (arg === "--help" || arg === "-h") opts.help = true;
        else if (arg === "--agent") {
            i += 1;
            opts.agent = argv[i];
        } else if (arg.startsWith("--agent=")) opts.agent = arg.slice("--agent=".length);
        else if (arg === "--repo") {
            i += 1;
            opts.repo = argv[i];
        } else if (arg.startsWith("--repo=")) opts.repo = arg.slice("--repo=".length);
        else if (arg.startsWith("-")) {
            status(`Unknown option: ${arg}`);
            opts.help = true;
        } else opts.skills.push(arg);
    }
    return opts;
}

async function listSkills() {
    let entries;
    try {
        entries = await readdir(SKILLS_DIR, {withFileTypes: true});
    } catch {
        return [];
    }
    const found = [];
    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        try {
            await stat(path.join(SKILLS_DIR, entry.name, "SKILL.md"));
            found.push(entry.name);
        } catch {
            // not a skill directory
        }
    }
    return found.sort((a, b) => a.localeCompare(b));
}

/**
 * Install one skill by delegating to `npx skills add`.
 *
 * @param {string} skill
 * @param {{repo: string, agent: ?string, yes: boolean, global: boolean, extra: string[], dryRun: boolean}} opts
 * @returns {Promise<number>}
 */
function install(skill, opts) {
    const npxArgs = ["skills", "add", opts.repo, "--skill", skill];
    if (opts.agent) npxArgs.push("--agent", opts.agent);
    if (opts.global) npxArgs.push("--global");
    if (opts.yes) npxArgs.push("--yes");
    npxArgs.push(...opts.extra);

    if (opts.dryRun) {
        status(`[dry-run] npx ${npxArgs.join(" ")}`);
        return Promise.resolve(0);
    }
    status(`Installing "${skill}" from ${opts.repo} ...`);
    return new Promise((resolve) => {
        // No `shell: true` (avoids Node's DEP0190 warning); on Windows npx is invoked
        // through cmd.exe explicitly. stdin is inherited so `npx skills` can prompt
        // interactively, while the child's stdout/stderr are routed to our stderr so
        // our stdout stays JSON-only.
        const command = IS_WINDOWS ? process.env.ComSpec || "cmd.exe" : "npx";
        const args = IS_WINDOWS ? ["/d", "/s", "/c", "npx", ...npxArgs] : npxArgs;
        const child = spawn(command, args, {stdio: ["inherit", 2, 2]}); // NOSONAR S4036: npx comes from the user's PATH on purpose (local dev tool).
        child.on("error", (error) => {
            status(`Failed to start npx: ${error.message}`);
            resolve(1);
        });
        child.on("close", (code) => resolve(code === null ? 1 : code));
    });
}

function printHelp() {
    status(
        [
            "Usage: node scripts/install.mjs [options] [skill ...]",
            "",
            "Options:",
            "  --all           install every skill in the repository",
            "  --agent <name>  agent to install to (forwarded to npx skills add)",
            "  -g, --global    install globally (forwarded)",
            "  -y, --yes       skip prompts (forwarded)",
            "  --list          list available skills and exit",
            "  --repo <url>    repository URL to install from",
            "  --dry-run       print the commands without executing them",
            "  -h, --help      show this help",
            "  -- <args>       pass the remaining arguments to npx skills add",
            "",
            "Run with --all to install every skill, or name the skills to install.",
            "Without --all and without skill names, this help is shown.",
            "Progress goes to stderr; the JSON result goes to stdout.",
        ].join("\n"),
    );
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    if (opts.help) {
        printHelp();
        emit({ok: true, help: true});
        return;
    }

    const available = await listSkills();

    if (opts.list) {
        emit({ok: true, repo: opts.repo, skills: available});
        return;
    }

    let requested;
    if (opts.all) {
        if (available.length === 0) {
            status("No skills found in the skills/ directory.");
            emit({ok: false, error: "no-skills-found"});
            process.exitCode = 1;
            return;
        }
        requested = available;
    } else if (opts.skills.length > 0) {
        requested = opts.skills;
    } else {
        printHelp();
        emit({ok: true, help: true});
        return;
    }
    const unknown = requested.filter((skill) => !available.includes(skill));
    for (const skill of unknown) {
        status(`Warning: "${skill}" is not a skill in this repository.`);
    }

    const installed = [];
    const failed = [];
    for (const skill of requested) {
        const code = await install(skill, opts);
        if (code === 0) {
            installed.push(skill);
            status(`Done: ${skill}`);
        } else {
            failed.push({skill, code});
            status(`Failed: ${skill} (exit code ${code})`);
        }
    }

    const ok = failed.length === 0 && unknown.length === 0;
    emit({ok, repo: opts.repo, dryRun: opts.dryRun, requested, installed, failed, unknown});
    if (!ok) process.exitCode = 1;
}

try {
    await main();
} catch (error) {
    status(`Unexpected error: ${error?.stack ?? error}`);
    emit({ok: false, error: String(error)});
    process.exitCode = 1;
}
