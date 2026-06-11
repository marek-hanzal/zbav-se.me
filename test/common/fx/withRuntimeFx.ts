import { getLogger } from "@logtape/logtape";
import type { Effect } from "effect";
import { withDateServiceFx } from "@/lib/common/date";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { withLocationConfigFx } from "~/session/location/server/context/withLocationConfigFx";
import type { testabase } from "~/test/testabase";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";
import { withUploadConfigFx } from "~/user/upload/server/context/withUploadConfigFx";
import { withUploadConfigEnv } from "~/user/upload/server/env/withUploadConfigEnv";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const logger = getLogger("zbav-se.me");

const withBaseRuntimeFx = (database: TestDatabase) => {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withLoggerFx(logger),
			withKyselyFx(database),
			withDateServiceFx(),
			withTransactionContextFx(),
			withUploadConfigFx(withUploadConfigEnv()),
		);
};

export const withRuntimeFx = (database: TestDatabase) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withBaseRuntimeFx(database),
			withLocationConfigFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				route: "/v1/routematrix",
			}),
		);
};
