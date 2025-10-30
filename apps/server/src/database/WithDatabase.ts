import type { Kysely, Transaction } from "kysely";
import type { Database } from "./Database";

export type WithDatabase = Kysely<Database> | Transaction<Database>;
