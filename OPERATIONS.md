# Governed laboratory simulation operations

## Supported local boundary

The production-shaped path is `/api/governed-lab-simulations`. A work item records experiment/model/dataset versions and digests, typed units and parameter bounds, deterministic seeds, sandbox/resource attestations, artifacts, comparisons, reference cases, sensitivity/error fixtures, and reproducible reports. All outputs are labelled simulated; clinical and safety-certification claims fail validation.

State progresses from draft through independent scientific review. Optimistic versions prevent stale transitions, and append-only tenant-scoped events preserve provenance.

## Security and scientific approval

JWT and tenant configuration fail closed. Scientist, lab instructor, safety reviewer, or admin roles may approve, never the creator. Full input/export and event access is limited to creator, approver, or admin. User code requires a default-deny network sandbox attestation and CPU/memory caps; this repository validates the attestation but does not provide or claim a sandbox.

Canonical request hashing binds idempotency keys to their exact semantic payload. Secrets are rejected from work items and integration payloads.

## Lifecycle

- `./start.sh check` performs configuration-only checks.
- `./start.sh start` uses already installed dependencies; it does not install, mutate schemas, seed, kill ports, or start global services.
- Run `ALLOW_SCHEMA_MIGRATION=true DATABASE_URL=... ./start.sh migrate` only as an explicitly reviewed schema operation.
- The destructive demo seed is never called by startup or CI, is forbidden in production, and requires explicit seed authorization and password.

Generated gap routes are unmounted. Generated prototype routes are opt-in outside production only.

## External systems and failure

Compute schedulers, notebooks, registries, object storage, and visualization are allow-listed outbox destinations, not live adapters. Approved work only can enqueue. A separately reviewed worker must enforce the recorded resource caps, resolve secret references, persist checkpoints/artifact receipts, and return success/failure. Bounded retry dead-letters after five failures. No compute, notebook, provider, empirical, clinical, or safety action occurs without external configuration and qualified scientific approval.

## Verification

Use `node --test server/governance/tests/*.test.js`, `node --check` for changed JavaScript, and `bash -n start.sh`. CI checks deterministic reference/sensitivity/error behavior, sandbox claims, authorization, migration text, idempotency, failure bounds, and lifecycle safety. Numerical validation against authoritative scientific datasets remains an external gate.

