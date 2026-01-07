import type { withDatabaseFx } from "@use-pico/common/database";
import { Context, Effect } from "effect";
import type { Database } from "~/database/Database";

export type KyselyContext = withDatabaseFx.Instance<Database>;

export class KyselyContextFx extends Context.Tag("KyselyContextFx")<
	KyselyContextFx,
	KyselyContext
>() {
	//
}

export const KyselyContextProvider = (database: KyselyContext) => {
	return Effect.provideService(KyselyContextFx, database);
};
