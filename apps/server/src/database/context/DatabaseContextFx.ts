import { Context, Effect } from "effect";
import type { WithDatabase } from "../WithDatabase";

export type KyselyContext = WithDatabase;

export class KyselyContextFx extends Context.Tag("KyselyContextFx")<
	KyselyContextFx,
	KyselyContext
>() {
	//
}

export const KyselyContextProvider = (database: KyselyContext) => {
	return Effect.provideService(KyselyContextFx, database);
};
