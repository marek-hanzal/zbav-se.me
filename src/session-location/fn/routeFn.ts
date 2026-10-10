import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { withLoggerFn } from "~/log/fn/withLoggerFn";
import { withLogMiddleware } from "~/request-middleware/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/request-middleware/middleware/withUserMiddleware";
import { withLocationConfigEnvFn } from "~/session-location/fn/withLocationConfigEnvFn";
import { withLocationConfigFn } from "~/session-location/fn/withLocationConfigFn";
import { routeFx } from "~/session-location/fx/routeFx";
import { RouteSchema } from "~/session-location/schema/RouteSchema";
import { zodFx } from "~/validation/fx/zodFx";

export namespace routeFn {
	export type Error = Effect.Error<routeFx>;
}

export const routeFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withUserMiddleware,
	])
	.validator(RouteSchema)
	.handler(async ({ data, context: { rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		const distance = await zodFx({
			schema: z.number(),
			dataFx: routeFx({
				...data,
			}),
		}).pipe(
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

		return distance;
	});
