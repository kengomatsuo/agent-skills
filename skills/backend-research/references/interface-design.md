# Designing an API or module interface

Adapted from addyosmani/agent-skills `api-and-interface-design` at aeac41d, MIT, Copyright (c) 2025 Addy Osmani.

An interface is any surface where one piece of code talks to another: an RPC, an edge function or Worker route, a webhook, a module's exports, a type shared by client and server. Read this at step 4 of `backend-research`, after the README exists. Where `supabase-conventions` or `lessons-money-ledger` rules on a point, that file wins and this one links to it.

## Contents

- Where this file stops and the house rules start
- Principles
- Errors
- Validation at the boundary
- Changing an interface that clients already run
- Idempotency
- Lists, filters and partial updates
- Naming
- TypeScript contracts
- Before you propose the design

## Where this file stops and the house rules start

| Point | Ruled by |
|---|---|
| RPC signatures, `default null` on omitted parameters, `SECURITY DEFINER` checks, sensitive transitions through RPCs | `supabase-conventions`, RPC & PostgREST and Auth & RLS |
| Money as integer minor units, server-derived amounts, snapshots, ledger entries | `supabase-conventions`, Data integrity, and `lessons-money-ledger` |
| A retried write returns the first result; the same key with other parameters is an error; a key is minted once per act | `lessons-money-ledger`, and `supabase-conventions`, Writes are idempotent |
| Primary-key minting (client UUIDv7 or database-only) | `supabase-conventions`, one policy per project |
| What a change breaks, including clients on last week's bundle | `blast-radius` |
| Migrations that rename or drop | `schema-change`, and `blast-radius` (its `references/deprecation-and-migration.md`) for removing a thing users rely on |
| Everything below | this file |

## Principles

**Hyrum's law.** With enough users, every observable behaviour gets depended on, whatever the contract says: error text, field order, timing, an undocumented null. Expose only what you mean to keep, and keep implementation detail out of responses. A safe-looking change can still break a client that read a quirk. The offline Expo and SwiftUI clients make this sharper, because an old build keeps calling for weeks.

**Contract first.** Write the types and the one-line behaviour of each call before the body: input, output, the errors it can return, whether a retry is safe. For an RPC that is the signature and a comment above `create function`. For a Worker route it is the input and output types in a shared package. The contract in the migration or the types file is the documentation; a prose spec drifts.

**Add, never modify.** A new optional field, a new optional parameter with a default, a new enum value that old clients can ignore. Never change a field's type, remove a field or reuse a name for a different meaning. When a shape truly must change, add the new one beside the old, move the clients, then remove the old through `blast-radius`'s `references/deprecation-and-migration.md`.

**One version at a time.** Avoid asking a consumer to pick between `v1` and `v2` of the same call. Two versions double the maintenance and split the bug fixes. Extend the one that exists. A parallel version is the last resort, and it needs a written removal date.

## Errors

Pick one error shape per surface and use it on every route of that surface. Mixed shapes (one route throws, one returns null, one returns `{ error }`) leave the client unable to predict anything.

- **RPCs and PostgREST:** the client already receives PostgREST's error object. Raise with a stable SQLSTATE or message code the client maps, and never put internal detail in the text.
- **Edge functions and Workers:** one body shape, such as `{ error: { code, message, details? } }`, where `code` is machine-readable and `message` is for a developer, not for the screen. Screen copy comes from the client's own strings keyed by `code`.
- Status codes carry the class: 400 invalid input, 401 not signed in, 403 signed in but not allowed, 404 not found, 409 conflict, 429 rate limit, 500 server fault. Pick 400 or 422 for validation once and keep it.
- Where a house kit already maps errors (`library-catalog`, house-kit), use it instead of a new mapper.

## Validation at the boundary

Validate where outside input enters, once, and let the types carry it inward.

- In this stack the database is a boundary. A client can call PostgREST and RPCs directly, so a TypeScript check in the app protects nobody. The RPC or table constraint (CHECK, NOT NULL, foreign key, RLS) is the real validation, and the client check is a courtesy.
- Identity, org scope and money come from the session and the server, never from the payload (`supabase-conventions`, Auth & RLS and Data integrity). A client figure is an assertion to compare, never the amount charged.
- Everything from a third party is untrusted: webhooks, gateway responses, an AI model's output. Parse the shape with a schema and verify the signature first. A check keyed by a missing secret fails closed (`lessons-money-ledger`).
- Parse environment variables once at startup and fail the boot when one is missing.
- Skip repeat validation between internal functions that share a type, and on rows your own writer just produced. A test that pins the shape the real writer emits covers that trust.

## Changing an interface that clients already run

- Add a parameter to an RPC with `default null`, and drop the old signature in the same migration. Two overloads side by side can leave PostgREST unable to pick one, so the call fails. Pin signatures with a test (`supabase-conventions`).
- An Expo build or a SwiftUI app in the store calls the old shape until its user updates. Run `blast-radius` before a change and keep the old shape working until the last supported build has moved.
- A field that clients read is removed in three steps: stop writing it, wait out the supported builds, drop it.
- A new enum value is a breaking change for any client that switches exhaustively. Say so in the contract and ship the client that handles it first.

## Idempotency

The rules are in `lessons-money-ledger` and `supabase-conventions`. These parts are Addy's and the house does not state them.

**Claim the key in one atomic operation.** A read of the key followed by the effect is a race; two concurrent retries both read "not seen". Let the unique constraint pick the winner:

```sql
insert into idempotency_keys (key, request_hash, state)
values ($1, $2, 'in_progress')
on conflict (key) do nothing
returning key;
-- no row returned: the key exists, so replay the stored result, or reject
-- when request_hash differs from the stored one.
```

In application code the same shape is an insert that catches the unique violation and rethrows any other error. Rethrowing is right there, since the failure happens before the effect. A follow-up after the effect commits never turns the result into an error (`lessons-money-ledger`).

**Decide what an in-flight duplicate gets.** The first request is still running when the second arrives, which is the common case during retry storms.

| Response | Use when |
|---|---|
| 409, retry later | the client can wait; simplest and safest |
| Wait, bounded | the caller needs the result synchronously |
| 202 with a status URL | the effect is long-running |

Never let the second caller through because the first looks stuck.

**Every call has three outcomes: success, failure and unknown.** A timeout says nothing about whether the effect applied. Record the intent before calling out (a gateway, a provider), so a crash between call and response leaves a row that something resolves later.

**Retention outlives the longest path that can re-deliver the intent**: a dead-letter queue replayed next week, a provider's dispute window, a till that stays offline for days. A 24-hour key behind a 7-day replay is a duplicate waiting to happen. No queue gives exactly-once across a consumer crash, so design for at-least-once with idempotent handling.

## Lists, filters and partial updates

**Pagination.** Every list is bounded from the start. Prefer keyset pagination (a cursor on the sort key plus the id) for any list that grows, because offset pages skip or repeat rows when data changes and slow down with depth. Use offset only for a small, bounded list. Return a total only when the screen shows one, and measure it at production size (`supabase-conventions`, Testing). The house has no ruling on cursor format yet; record the choice in the project.

**Filters** are explicit parameters with a default. A filter the client may omit takes `default null`.

**Partial updates.** A plain column PATCH suits low-risk fields such as a display name. A sensitive transition (status, money, permission) goes through a named RPC, never a raw column update (`supabase-conventions`). In a partial update, an omitted field means "leave alone", so clearing a field needs an explicit way to say so, since `null` already means omitted for an RPC parameter. Make that a separate parameter or a separate call.

## Naming

- The house is English in code. Identifiers in the contract are English whatever language the app speaks.
- Postgres and PostgREST return `snake_case`. A client maps at one place near the generated types; it does not rename fields by hand in each screen. Addy's camelCase JSON rule does not override this.
- Action RPCs are verbs (`close_bill`, `refund_payment`) because they are actions. The "no verbs in URLs" rule applies to resource routes on a Worker, where plural nouns and the HTTP method name the operation.
- Booleans read as a state: `is_`, `has_`, `can_`. Match the project's existing status spelling and let the Postgres enum be the source.
- Dates cross JSON as ISO strings, never as `Date`. Day boundaries are venue-local (`supabase-conventions`, Data integrity).

## TypeScript contracts

**Discriminated unions for variants.** Each state carries only its own fields, and the compiler narrows on the tag:

```typescript
type Order =
  | { status: 'open' }
  | { status: 'paid'; paidAt: string; paymentId: PaymentId }
  | { status: 'cancelled'; reason: string; cancelledAt: string };
```

Generate the database side with `supabase gen types typescript` and build the union over it; a hand-edited types file is a flagged stopgap.

**Separate input from output.** The input holds what the caller may send. The output adds what the server sets: id, timestamps, attribution, derived money. A field the server owns never appears in the input type.

**Branded ids** stop a `UserId` passing as an `OrderId`:

```typescript
type OrderId = string & { readonly __brand: 'OrderId' };
```

Brand at the one place an id enters the typed layer, such as the parse step. An id that becomes a provider's order id is minted by the server (`lessons-money-ledger`).

## Before you propose the design

Show the API as a table: call, input type, output type, errors, retry-safe yes or no, who may call it. Then check:

- [ ] Every call has typed input and output
- [ ] One error shape per surface
- [ ] Validation sits at the database or edge boundary, with identity and money from the server
- [ ] Every list is bounded
- [ ] Every new field and parameter is optional with a default
- [ ] Every write a retry could double honours a key, claimed atomically
- [ ] The in-flight duplicate answer and the unknown outcome are chosen on purpose
- [ ] Old client builds still work, checked with `blast-radius`
- [ ] The types are committed with the implementation
