import { getLogger } from "@logtape/logtape";
import type { Effect } from "effect";
import { withLoggerFx } from "@/lib/common/log";
import { ViteEnvSchema } from "~/common/env/ViteEnvSchema";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import type { testabase } from "~/test/testabase";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

const logger = getLogger("zbav-se.me");

const withBaseRuntimeFx = (database: TestDatabase) => {
	const viteConfig = ViteEnvSchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withLoggerFx(logger),
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx(),
			withUploadFx({
				cdn: viteConfig.VITE_CONTENT_CDN,
			}),
		);
};

export const withRuntimeFx = (database: TestDatabase) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withBaseRuntimeFx(database),
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				route: "/v1/routematrix",
			}),
		);
};
