# Principles, with when each one is wrong

## Contents
- How to use this file
- KISS
- DRY
- Rule of three
- The wrong abstraction
- YAGNI
- Beck's four rules of simple design
- Deep modules
- SOLID (symptom table)
- Command-query separation
- Composition over inheritance
- Fowler's smells
- Technical debt quadrant
- Mistakes models make more than people do

## How to use this file

Each principle is a reason to look, never a verdict. Every entry gives what it says, how to
spot a breach, the fix, and the case where applying it makes the code worse. A finding that
cites a principle must also say why the "wrong when" case does not apply.

## KISS

**Says:** the simplest design that does the job beats a more general one.
**Spot:** layers, options or indirection the current callers do not use; a reader needs three
files open to follow one call.
**Fix:** inline the layer, delete the option, call the target.
**Wrong when:** "simple" means a shortcut that pushes complexity to every caller (a function
that returns `any` is short and makes everyone else guess).

## DRY

**Says:** "Every piece of knowledge must have a single, unambiguous, authoritative
representation" (Hunt and Thomas, *The Pragmatic Programmer*, tip 15,
https://pragprog.com/tips/). It is about knowledge, never about identical text.
**Spot:** one business rule written twice (client and SQL, type and constraint, code and docs);
two copies that have already drifted apart.
**Fix:** pick the single source; the others import, generate from or call it.
**Wrong when:** two blocks look alike but encode rules that will change for different reasons.
Merging them makes every change to one a risk to the other.

## Rule of three

**Says:** write it once; copy it the second time with a wince; extract on the third. Fowler's
*Refactoring* gives it as Don Roberts' rule (secondary source checked:
https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming)).
**Spot:** the third copy of the same shape.
**Fix:** extract, with the name of the rule the three share.
**Wrong when:** the two copies have already drifted on something that should be the same:
then two is enough, because the drift is a live bug.

## The wrong abstraction

**Says:** duplication is far cheaper than the wrong abstraction (Sandi Metz, "The Wrong
Abstraction", 2016,
https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction). Kent C. Dodds calls the same idea
AHA, avoid hasty abstractions (https://kentcdodds.com/blog/aha-programming).
**Spot:** a shared function with a flag or branch per caller; callers that pass parameters only
to switch parts of it off.
**Fix:** inline it back into every caller, delete from each caller what it does not use, then
extract only what is truly shared.
**Wrong when:** the branches encode one real rule with real variants; then the fix is a table
of variants, not inlining.

## YAGNI

**Says:** do not build a capability before it is needed
(https://martinfowler.com/bliki/Yagni.html). Fowler lists four costs of a presumptive feature:
building it, the delay of what you did not build, carrying it, and repairing it when it turns
out wrong.
**Spot:** a flag, option, generic parameter, interface, factory or hook with no caller today;
names like `enable_*`, `*_v2`, `*_mode` with one value in use.
**Fix:** delete it and keep the concrete behaviour.
**Wrong when:** the code is a published interface or a stored format: changing it later costs
a migration, so the "future" shape is a present cost of the contract.

## Beck's four rules of simple design

In priority order: passes the tests; reveals intention; has no duplication; has the fewest
elements (https://martinfowler.com/bliki/BeckDesignRules.html). Use the order to break ties: a name that reveals
intent wins over removing a duplicated line; removing an element never wins over either.

## Deep modules

**Says:** a good module hides a lot of behaviour behind a small interface (John Ousterhout,
*A Philosophy of Software Design*; only secondary summaries were checked, e.g.
https://blog.pragmaticengineer.com/a-philosophy-of-software-design-review/). Shallow modules (an interface as complex as the body) add
cost and give nothing.
**Spot:** the deletion test: delete the module and inline it into its callers. If nothing gets
harder, it was shallow. Also: a seam with one adapter is hypothetical; two make it real.
**Fix:** merge shallow pieces into one module with a smaller interface; delete pass-throughs.
**Wrong when:** the small module is the seam a test needs (a real adapter and a test adapter).

## SOLID (symptom table)

| Symptom | Principle | Fix |
|---|---|---|
| A module changes for two unrelated reasons (two people, two features) | Single responsibility: "one, and only one, reason to change" (http://butunclebob.com/ArticleS.UncleBob.PrinciplesOfOod) | split along the two reasons |
| Adding a variant means editing a switch in several places | Open-closed | one table or one polymorphic call both sites use |
| A subtype overrides a method to throw "unsupported" or to ignore input | Liskov substitution | drop the inheritance; compose |
| An interface forces implementers to stub methods they do not need | Interface segregation | split the interface by caller |
| Domain logic constructs its own database client, clock or network call | Dependency inversion | accept the dependency as a parameter; the interface lives with the caller |

**Wrong when:** SOLID applied to code with one caller and one variant produces interfaces,
factories and registries for nothing. That is the YAGNI breach, not good design.

## Command-query separation

A function either answers a question or changes something, not both (coined by Bertrand Meyer;
https://martinfowler.com/bliki/CommandQuerySeparation.html). A `get`,
`is` or `has` that writes is a finding. **Wrong when:** the operation is atomic by nature
(pop from a stack, insert-and-return-id).

## Composition over inheritance

Prefer holding a collaborator to extending a base class.
**Spot:** a base class with flags its subclasses set to turn its behaviour off; inheritance
deeper than two levels in application code. **Wrong when:** the framework requires the
subclass (a few UI and ORM APIs do).

## Fowler's smells

A smell is a "surface indication that usually corresponds to a deeper problem"
(https://martinfowler.com/bliki/CodeSmell.html). The ones the lenses check by name: mysterious
name, duplicated code, long function, long parameter list, divergent change, shotgun surgery,
feature envy, data clumps, primitive obsession, repeated switches, speculative generality,
message chains, middle man and refused bequest. Each is a "possible X" until the code shows the
cost.

## Technical debt quadrant

Fowler's quadrant (https://martinfowler.com/bliki/TechnicalDebtQuadrant.html) splits debt by
reckless or prudent, and deliberate or inadvertent. Only the
prudent deliberate kind ("ship now, deal with the consequences") is a choice someone made with
a plan. When a finding is that kind, look for the plan (a TODO with a date, a plan doc) and
check whether its trigger has passed before calling it debt.

## Mistakes models make more than people do

Code written by an agent carries a recognisable set of debt. Check for each:

- A catch-all that returns null, an empty list or "ok", so a failure looks like empty data.
- Null and type checks for values the type or the caller already rules out.
- An interface, factory or base class with exactly one implementation.
- Comments that repeat the line under them, step numbers, narrated history.
- A new helper that re-implements one the codebase already has.
- A call to an API that does not exist in the installed version.
- A copy of a nearby function edited into shape, carrying the original's edge-case bugs.
- An option or flag "for flexibility" that nothing sets.
- A new dependency for what ten lines cover.
- A hardcoded success or fixture value in production code, or a test weakened to pass.
