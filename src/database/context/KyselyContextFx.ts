import { Context } from "effect";
import type { Database } from "~/database/type/Database";
import type { withDatabaseFx } from "~/database-query/fx/withDatabaseFx";

export type KyselyContext = withDatabaseFx.Instance<Database>;

export class KyselyContextFx extends Context.Service<KyselyContextFx, KyselyContext>()(
	"KyselyContextFx",
) {
	//
}
