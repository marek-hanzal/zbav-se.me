import { Context } from "effect";
import type { withDatabaseFx } from "@/lib/common/database";
import type { Database } from "~/server/database/Database";

export type KyselyContext = withDatabaseFx.Instance<Database>;

export class KyselyContextFx extends Context.Tag("KyselyContextFx")<
	KyselyContextFx,
	KyselyContext
>() {
	//
}
