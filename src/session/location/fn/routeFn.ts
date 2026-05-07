import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { routeFx } from "~/session/location/server/fx/routeFx";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import { RouteSchema } from "~/session/location/server/schema/RouteSchema";

export namespace routeFn {
	export type Error = Effect.Effect.Error<routeFx>;
}

export const routeFn = createServerFn()
	.middleware([
		withLogMiddleware,
		withUserMiddleware,
	])
	.inputValidator(RouteSchema)
	.handler(async ({ data, context: { rootLogger }, serverFnMeta: { name } }) => {
		const logger = rootLogger.getChild([
			"fn",
			name,
		]);
		logger.trace(name, data);

		const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

		const distance = await zodFx({
			schema: z.number(),
			dataFx: routeFx({
				...data,
			}),
		}).pipe(
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

		return distance;
	});
