import type { Transaction } from "kysely";
import type { Database } from "./Database";

export type WithTransaction = Transaction<Database>;
