import { Context } from "effect";
import type { Migration } from "kysely";

export type MigrationContext = Record<string, Migration>;

export class MigrationContextFx extends Context.Tag("MigrationContextFx")<
	MigrationContextFx,
	MigrationContext
>() {
	//
}
