import type { Effect } from "effect";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import type { testabase } from "~/test/testabase";
import { withTransactionContextFx } from "~/user/transaction/server/context/withTransactionContextFx";
import { withUploadFx } from "~/user/upload/server/context/withUploadFx";

type TestDatabase = Awaited<ReturnType<typeof testabase>>;

export const withRuntimeFx = (database: TestDatabase) => {
	const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

	return <A, E, R>(eff: Effect.Effect<A, E, R>) =>
		eff.pipe(
			withKyselyFx(database),
			withDateFx,
			withTransactionContextFx(),
			withLocationFx({
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
			}),
			withUploadFx({
				cdn: "https://cdn.zbav-se.me",
			}),
		);
};
