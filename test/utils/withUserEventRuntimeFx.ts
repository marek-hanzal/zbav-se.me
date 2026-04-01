import { getLogger } from "@logtape/logtape";
import type { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import type { testabase } from "~/test/testabase";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export const withUserEventRuntimeFx = (database: TestDatabase) => {
	const logger = getLogger("zbav-se.me");

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(withLoggerFx(logger), withKyselyFx(database), withDateFx);
};
