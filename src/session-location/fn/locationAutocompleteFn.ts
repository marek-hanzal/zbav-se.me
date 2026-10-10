import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFn } from "~/database/fn/withKyselyFn";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withDatabaseMiddleware } from "~/request-middleware/middleware/withDatabaseMiddleware";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withLocationConfigEnvFn } from "~/session-location/fn/withLocationConfigEnvFn";
import { withLocationConfigFn } from "~/session-location/fn/withLocationConfigFn";
import { locationAutocompleteFx } from "~/session-location/fx/locationAutocompleteFx";
import { LocationAutocompleteSchema } from "~/session-location/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/session-location/schema/LocationSchema";
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
			withKyselyFn(database),
			withLocationConfigFn(
				withLocationConfigEnvFn({
					api: "https://api.geoapify.com",
					autocomplete: "/v1/geocode/autocomplete",
					route: "/v1/routematrix",
				}),
			),
			withLoggerFn(rootLogger),
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
