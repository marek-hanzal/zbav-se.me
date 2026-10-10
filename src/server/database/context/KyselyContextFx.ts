import { Context } from "effect";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";
import type { Database } from "~/server/database/Database";

export type KyselyContext = withDatabaseFx.Instance<Database>;

export class KyselyContextFx extends Context.Service<KyselyContextFx, KyselyContext>()(
	"KyselyContextFx",
) {
	//
}
