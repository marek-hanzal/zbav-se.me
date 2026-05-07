import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodGuardFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export namespace locationAutocompleteFn {
	export type Error = Effect.Effect.Error<locationAutocompleteFx>;
}

export const locationAutocompleteFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(LocationAutocompleteSchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

		return zodGuardFx({
			schema: z.array(LocationSchema),
			dataFx: locationAutocompleteFx(data),
		}).pipe(
			withKyselyFx(database),
			withLocationFx({
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
				route: "/v1/routematrix",
			}),
			withLoggerFx(rootLogger),
			Effect.tapError((error) => {
				return Effect.sync(() => {
					logger.error(error._tag, {
						error,
					});
				});
			}),
			Effect.runPromise,
		);
	});
