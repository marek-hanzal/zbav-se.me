import { Context, Effect } from "effect";
import type { WithDatabase } from "../WithDatabase";

export class DatabaseContextFx extends Context.Tag("DatabaseContextFx")<
	DatabaseContextFx,
	WithDatabase
>() {
	//
}

export const DatabaseContextProvider = (database: WithDatabase) =>
	Effect.provideService(DatabaseContextFx, database);
