import { getLogger } from "@logtape/logtape";
import type { Effect } from "effect";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withDateServiceFn } from "~/date/fn/withDateServiceFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { ServerGeoapifySchema } from "~/server-env/schema/ServerGeoapifySchema";
import { withLocationConfigFn } from "~/session-location/fn/withLocationConfigFn";
import type { testabaseFn } from "~/test/testabaseFn";
import { withTransactionContextFn } from "~/user-transaction/fn/withTransactionContextFn";
import { withUploadConfigEnvFn } from "~/user-upload/fn/withUploadConfigEnvFn";
import { withUploadConfigFn } from "~/user-upload/fn/withUploadConfigFn";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;

const logger = getLogger("zbav-se.me");

const withBaseRuntimeFn = (database: TestDatabase) => {
	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withLoggerFn(logger),
			withKyselyFn(database),
			withDateServiceFn(),
			withTransactionContextFn(),
			withUploadConfigFn(withUploadConfigEnvFn()),
		);
};

export const withRuntimeFn = (database: TestDatabase) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withBaseRuntimeFn(database),
			withLocationConfigFn({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				route: "/v1/routematrix",
			}),
		);
};
