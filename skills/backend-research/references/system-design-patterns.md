# System design patterns: when each one earns its cost

Read this when a design asks "do we need a cache, a queue, a fan-out, a Bloom filter, a second service?" Each entry gives the rule, the check that decides it, and the primary source. The reels are the prompt for the entry; the source is what backs it. Where a number comes only from a reel it says so.

## Contents
- Feed fan-out: write-time copies and the large-account exception
- Bloom filter in front of a lookup
- Sessions behind more than one server
- Monolith or services
- The other building blocks (queues, idempotency, SSE, CQRS)

## Feed fan-out: write-time copies and the large-account exception

- **Build each reader's timeline when a post is written, so opening the app is one read.** A timeline built at read time costs one lookup per followed account per open. Twitter's own infrastructure post names a Fanout Service that writes into Haplo, the Redis-backed primary cache for Tweet timelines, which the Timeline Service reads. ([reel](https://www.instagram.com/reel/DeztJNCBv-6/); source: blog.x.com/en/engineering/the-infrastructure-behind-twitter-scale, 2017-01-19)
- **Skip the copy for an account whose post would cost too much to copy, and merge that account's posts when the reader opens the app.** The reel's test: one post costs more than about 5 seconds of the whole copy-worker pool, or copying costs more writes a day than the followers' reads. Worked case from the reel: 10M followers at 50,000 copies per second is 200 seconds of the pool (the arithmetic holds). The hybrid itself (write-time copies for ordinary accounts, read-time merge for very large ones) is widely described, and Twitter's 2012 "Timelines at Scale" talk is the usual origin, but the talk's text was not available this session and no primary page gave the follower cutoff. Treat any cutoff (10,000 is the figure often repeated) as unverified and derive yours from the cost test above. ([reel](https://www.instagram.com/reel/DeztJNCBv-6/))
- **Size for the spike, then add spare for a lost machine, and scale up before a known event.** Reel example: a 4x World Cup spike turns 6 servers of work into about 24, so run 30; copy workers that need 10 run 12. Twitter's post says it provisions for 3 to 10 times normal peaks ahead of major events in a region. The server counts are the reel's own assumptions. ([reel](https://www.instagram.com/reel/DeztJNCBv-6/); same Twitter source)

## Bloom filter in front of a lookup

- **Use a Bloom filter to skip the database when the answer is "not there".** A zero bit on any hash position means the item was never added, a certain no. All ones means maybe, so ask the real store. Redis lists "is this username taken" as a use. ([reel](https://www.instagram.com/reel/De4HO5mTMlh/); source: redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/)
- **Size it from the error rate: bits per item = -ln(p) / ln(2)^2, hash functions = ceil(-ln(p) / ln 2).** Redis gives 9.585 bits and 7 hashes at 1%, 14.378 bits and 10 hashes at 0.1%. The reel's "about 1.2 GB for a billion names at 1%" checks out: 10^9 x 9.585 bits is 1.198 GB. ([reel](https://www.instagram.com/reel/De4HO5mTMlh/); same Redis page)
- **A filter that outgrows its capacity either gets slower or less accurate.** Redis stacks sub-filters, so adds stay the same speed and checks get slower; with `NONSCALING` the false-positive rate climbs instead. Reserve capacity for the growth you expect. Plain Bloom filters cannot delete an item; Redis points to Cuckoo filters when you need deletes. ([reel](https://www.instagram.com/reel/De4HO5mTMlh/); same Redis page)
- **A "free" answer still gets confirmed where it matters.** A signup that passes the filter still needs the database unique constraint to decide. The filter only removes the load of the clear misses.

## Sessions behind more than one server

- **Do not keep login sessions in one server's memory once a second server sits behind a load balancer.** The next request can land on the server that has never seen the user. Keep the session in a shared store with expiry (Redis or Memcached) or use signed stateless tokens. ([reel](https://www.instagram.com/reel/DeNtEGxlPQX/); source: 12factor.net/processes)
- **Sticky sessions are a stopgap, not a design.** The twelve-factor page says they "should never be used or relied upon". It holds when a server restarts or drops out: every user pinned to it loses the session. ([reel](https://www.instagram.com/reel/DeNtEGxlPQX/); same source)

## Monolith or services

- **Start as one deployable and split only for a measured reason.** Martin Fowler: do not start a new project with microservices, because services carry a standing management cost and boundaries are hard to place before the product is known; a monolith lets you find them first. He adds that the view is not unanimous and the evidence is thin. ([reel](https://www.instagram.com/reel/DfGCY47ptac/); source: martinfowler.com/bliki/MonolithFirst.html)
- **A split on a hot path adds network hops and encoding work, so benchmark that path before and after.** The reel's demo on equal hardware: one 8-core monolith about 60,000 requests, the same machines split into smaller boxes about 50,000 (down 17%, checks out), microservices about 18,000 (30% of the monolith), and load balancing plus gRPC back to about 30,000 at roughly twice the CPU per request. These are the creator's demo figures with no published method. Unverified; use them as a reason to measure, not as a number to quote. ([reel](https://www.instagram.com/reel/DfGCY47ptac/))

## The other building blocks

The creator lists the pieces that recur in system design. Where one touches a house project, this is the primary page to read first. ([reel](https://www.instagram.com/reel/DfFXY0wRpXC/))

| Block | When it earns its cost | Primary page |
|---|---|---|
| Idempotency key | A client retry after a dropped connection must not charge or create twice. Stripe v1 saves the first response per key (up to 255 characters, pruned after at least 24 hours), rejects a reused key with different parameters, and accepts keys on POST only | docs.stripe.com/api/idempotent_requests |
| Queue plus idempotent consumer | Slow or retried work off the request path; the consumer must tolerate duplicate delivery | learn.microsoft.com/en-us/azure/architecture/patterns/cqrs (states it for the read-model consumer) |
| CQRS | Reads and writes need different scaling or shapes. Microsoft's page warns of added complexity and eventual consistency and says it does not fit simple CRUD domains | learn.microsoft.com/en-us/azure/architecture/patterns/cqrs |
| Server-sent events instead of polling | One-way server push over plain HTTP with automatic reconnect. Over HTTP/1.1 a browser allows 6 connections per domain, shared across tabs; HTTP/2 negotiates about 100 streams | developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events |
| Cache | Protects the store from read load and holds objects that are costly to build. Twitter reports cache is about 3% of its footprint | blog.x.com/en/engineering/the-infrastructure-behind-twitter-scale |

Caching, indexing, async writes, sharding, workflow engines and self-healing are named in the reel without a rule or number, so nothing more is recorded for them.

## Not taken

- The "$12 server challenge" (an assembly entry at 171,000 concurrent users on a 1 vCPU box) is a contest result with no rule a house project can apply ([reel](https://www.instagram.com/reel/De0L0-wN7P8/)).
- "Write the code in Rust because the compiler checks AI output" is an opinion about language choice; the house stacks are fixed by their own rules ([reel](https://www.instagram.com/reel/DeUm6wQM_DD/)).
