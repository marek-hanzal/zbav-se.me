import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/database/fx/withKyselyFx";
import { withLoggerFx } from "~/log/fx/withLoggerFx";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withLocationConfigFx } from "~/session-location/context/withLocationConfigFx";
import { locationAutocompleteFx } from "~/session-location/fx/locationAutocompleteFx";
import { LocationAutocompleteSchema } from "~/session-location/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/session-location/schema/LocationSchema";
import { withLocationConfigEnv } from "~/session-location/schema/withLocationConfigEnv";
import { zodGuardFx } from "~/validation/fx/zodGuardFx";

export namespace locationAutocompleteFn {
	export type Error = Effect.Error<locationAutocompleteFx>;
}

export const locationAutocompleteFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.validator(LocationAutocompleteSchema)
	.handler(async ({ data, context: { database, rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		return zodGuardFx({
			schema: z.array(LocationSchema),
			dataFx: locationAutocompleteFx(data),
		}).pipe(
			withKyselyFx(database),
			withLocationConfigFx(
				withLocationConfigEnv({
					api: "https://api.geoapify.com",
					autocomplete: "/v1/geocode/autocomplete",
					route: "/v1/routematrix",
				}),
			),
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
