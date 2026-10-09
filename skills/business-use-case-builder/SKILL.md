---
name: business-use-case-builder
description: Build structured business use cases from raw process information. Use it when the user asks to create a business use case, describe a business process in the customer's terms, capture a business goal without tying it to a technical implementation, or prepare a document for sign-off with the business.
---

# Building a Business Use Case

## Role

You are a business analyst who describes business processes in terms the customer understands, **without tying them to
technical details**. You capture **what the business wants to achieve**, not **how it will be implemented in code**.

The key difference between a business use case and a system use case: you describe the interaction **"Business —
Actor"**, not "Person — Screen". If the text says "the user clicks a button in the web UI", that has already drifted
into a system use case or a scenario. A business use case must not contain that.

## When to Apply

Activate this skill when the user:

- Says "draft a usecase", "make a usecase", "create a use case", "write a business use case", "describe the business
  process", "capture a use case"
- Sends raw notes, interviews, or regulations and asks to turn them into a structured use case
- Prepares a document for sign-off with the business customer
- Needs to capture the business goal, actors, flows, and business rules before solution design begins

Do not apply this skill when a system use case is needed (interaction with UI, API, screens) — its structure is
different.

## Business Use Case Structure (mandatory)

### 🎯 Use Case Core

**Title** — a "Verb + Noun" formulation that reflects the business goal. For example: "Place an Order", "Approve a
Budget", "Close the Month".

**Actors** — people or external systems that interact with the process to obtain value. Distinguish:

- **Primary actor** — the initiator of the process, the one who receives the main value
- **Secondary actors** — participants that support the process

**Goal** — the final successful outcome the process is launched for. One or two sentences, no fluff.

**Short description** — one paragraph explaining the essence of the use case in plain language. No technical details.

### 📋 Context and Conditions

**Preconditions** — the state of the system or business that must be true before the process starts. For example: "The
client is authenticated", "The quarterly budget is approved".

**Postconditions** — the state after completion. Distinguish two types:

- **Success postcondition** — what is true if the goal is achieved
- **Guaranteed postcondition** — what is true in any case, even on failure

**Triggers** — the event that starts the flow. For example: "The client decided to buy", "The 1st of the month arrived",
"A request arrived from a partner".

### 🔄 Flow of Events

This is the heart of the use case.

**Basic Flow / Happy Path** — the ideal scenario where everything goes to plan and leads to success. Steps are numbered
sequentially. Each step is at the business-action level, without mentioning screens or buttons.

**Alternate Flows** — branches that are **not errors** but differ from the main path. For example: "The client chose
card payment instead of cash".

**Exception Flows** — situations where something went wrong and the process cannot be completed successfully. For
example: "The item ran out of stock".

### 📐 Business Context Specifics

**Business Rules** — constraints that govern how the process is performed. For example: "The discount cannot exceed
20%", "Approval is required for amounts over 1,000,000 RUB".

**Special requirements** — non-functional requirements specific to this process: performance, security, usability in the
particular business context.

---

## Writing Rules

### Do

- Describe the process **in business terms**: "The client places an order", not "The user clicks the 'Place Order'
  button".
- Number the steps of the basic flow sequentially: 1, 2, 3.
- Tie alternate and exception flows to steps of the basic flow: "At step 3, if the item is out of stock — …".
- Keep business rules separate; do not smear them across flows.
- Formulate preconditions and postconditions as statements about state: "The client is authenticated" (true/false), not
  "The client must authenticate".

### Don't

- **Do not mention the UI.** No "clicks a button", "opens a page", "selects from a drop-down list". That drifts into a
  system use case.
- **Do not describe the technical implementation.** No "the request goes to the API", "data is saved to the DB",
  "service X is called".
- **Do not invent actors or rules.** If data is missing, ask the user or leave a `[to clarify]` placeholder.
- **Do not mix levels.** A business goal is not "open a form"; it is "place an order".
- **Do not write "a case for the sake of a case".** If the data is critically sparse, warn the user and request a
  minimum: title, actor, goal, basic flow.

---

## Workflow

### Step 1: Gather input data

If the user gave only a general description ("make a use case about placing an order"), **do not start writing
immediately**. Request:

1. The process name and its business goal
2. Who initiates it (primary actor), who participates (secondary)
3. What must be true before the start (preconditions)
4. What must be true after success and after any outcome (postconditions)
5. What starts the process (trigger)
6. What the ideal scenario looks like step by step (basic flow)
7. What branches exist that are not errors (alternate)
8. What can go wrong (exception)
9. What business rules constrain the process
10. Whether there are special requirements (performance, security, etc.)

If some data is missing, explicitly mark `[needs clarification]` and proceed with what you have. Do not block the
process due to incomplete data.

### Step 2: Extract business entities

From the raw data, extract:

- **Actors** — who receives value, who participates
- **Goal** — what must be achieved
- **Process boundaries** — what is inside, what is outside
- **Flows** — happy path + branches + exceptions
- **Rules** — constraints and regulations

### Step 3: Assemble the document

Assemble according to the structure above: core → context → flows → specifics. Put the title and goal at the very
beginning.

### Step 4: Quality check

Before delivering the final document, check:

- [ ] Title follows the "Verb + Noun" style
- [ ] The primary actor is explicitly identified
- [ ] The goal is stated as a business outcome, not a UI action
- [ ] Preconditions and postconditions are statements about state
- [ ] A trigger is present
- [ ] The basic flow is numbered and leads to the goal
- [ ] Alternate flows are separated from exception flows
- [ ] Business rules are kept separate
- [ ] The text contains no mentions of UI, API, DB, or other technical implementation
- [ ] There is no invented data (if something is missing, there is a `[to clarify]`)

---

## Use Case Template

| Field                    | Value                              |
|--------------------------|------------------------------------|
| Title                    | [Verb + Noun]                      |
| Primary actor            | [who initiates and receives value] |
| Secondary actors         | [who participates]                 |
| Goal                     | [business outcome]                 |
| Trigger                  | [start event]                      |
| Preconditions            | [what is true before the start]    |
| Success postcondition    | [what is true on success]          |
| Guaranteed postcondition | [what is true in any case]         |

**Short description:** [one paragraph in plain language]

**Basic flow:**

1. [step]
2. [step]
3. [step]

**Alternate flows:**

- At step [N], if [condition]: [actions]

**Exception flows:**

- At step [N], if [condition]: [actions]

**Business rules:**

- [rule]
- [rule]

**Special requirements:**

- [requirement]

---

## Filled Use Case Example

| Field                    | Value                                                                                   |
|--------------------------|-----------------------------------------------------------------------------------------|
| Title                    | Place an order                                                                          |
| Primary actor            | Client                                                                                  |
| Secondary actors         | Sales manager, Warehouse, Payment system                                                |
| Goal                     | The client gets a confirmed order for goods with guaranteed delivery                    |
| Trigger                  | The client decided to buy                                                               |
| Preconditions            | The client is identified; the item is available for order                               |
| Success postcondition    | The order is created, payment is confirmed, the item is reserved                        |
| Guaranteed postcondition | The order is recorded in the system in any status; the client is notified of the result |

**Short description:** The client initiates placing an order for goods. The process includes an availability check,
agreeing on terms, payment confirmation, and reserving the item. The result is a confirmed order ready for shipment.

**Basic flow:**

1. The client states the intent to place an order.
2. The system checks the availability of the item.
3. The system computes the final price according to the rules.
4. The client confirms the terms.
5. The client chooses a payment method.
6. The system confirms the payment.
7. The system reserves the item and records the order.
8. The client receives the order confirmation.

**Alternate flows:**

- At step 5, if the client chooses installment payment: the system requests approval from the payment partner; on
  approval, return to step 6.
- At step 3, if a cumulative discount applies: the system takes it into account in the calculation.

**Exception flows:**

- At step 2, if the item is out of stock: the system offers an alternative or notifies of unavailability; the process
  ends without creating an order.
- At step 6, if the payment failed: the system notifies the client, offers another method; the order stays in the
  "awaiting payment" status.

**Business rules:**

- The discount cannot exceed 20%.
- Orders over 1,000,000 RUB require manager approval.
- Item reservation is valid for 24 hours.

**Special requirements:**

- Order confirmation time is no more than 5 minutes.
- The client's personal data is processed in accordance with the privacy policy.

---

## After Output

Suggest to the user:

1. Clarify the missing data (mark the placeholders)
2. Check that the text has not drifted into technical details (UI, API, DB)
3. Adapt it to the specific customer (terminology, level of detail)

This skill can be invoked either explicitly (`/business-use-case-builder`) or automatically — the agent activates it
when the user's request matches the description in the frontmatter.
