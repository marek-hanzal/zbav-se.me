import { Context, Effect } from "effect";
import type { WithDatabase } from "../WithDatabase";

export type DatabaseContext = WithDatabase;

export class DatabaseContextFx extends Context.Tag("DatabaseContextFx")<
	DatabaseContextFx,
	DatabaseContext
>() {
	//
}

export const DatabaseContextProvider = (database: DatabaseContext) => {
	return Effect.provideService(DatabaseContextFx, database);
};
