import type { Kysely, Transaction } from "kysely";
import type { Database } from "~/database/Database";

export type WithDatabase = Kysely<Database> | Transaction<Database>;
