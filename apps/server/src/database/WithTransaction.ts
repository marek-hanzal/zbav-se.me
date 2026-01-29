import type { ControlledTransaction, Transaction } from "kysely";
import type { Database } from "~/database/Database";

export type WithTransaction = Transaction<Database>;

export type WithControlledTransaction = ControlledTransaction<Database>;
