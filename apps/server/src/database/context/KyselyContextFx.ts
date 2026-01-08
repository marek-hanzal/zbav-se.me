import type { withDatabaseFx } from "@use-pico/common/database";
import { Context } from "effect";
import type { Database } from "~/database/Database";

export type KyselyContext = withDatabaseFx.Instance<Database>;

export class KyselyContextFx extends Context.Tag("KyselyContextFx")<
	KyselyContextFx,
	KyselyContext
>() {
	//
}
