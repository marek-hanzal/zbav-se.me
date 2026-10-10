# System Migration

This domain contains the protected migration executor and its schema. Database migrations and their input data live in `src/database-migration/`; maintenance data lives in `src/system-seed/data/`.

Periodic cleanup jobs live in their owning domain `cron/` folders and are registered
through `src/cron/fx/`.
