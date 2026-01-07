import { Context, Effect } from "effect";
import type { Migration } from "kysely";

export type MigrationContext = Record<string, Migration>;

export class MigrationContextFx extends Context.Tag("MigrationContextFx")<
	MigrationContextFx,
	MigrationContext
>() {
	//
}

export const MigrationContextProvider = (context: MigrationContext) => {
	return Effect.provideService(MigrationContextFx, context);
};
