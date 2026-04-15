import { createServerFn } from "@tanstack/react-start";
import { Effect } from "effect";
import { z } from "zod";
import { zodFx } from "@/lib/common/fx";
import { withLoggerFx } from "@/lib/common/log";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { withLogMiddleware } from "~/server/middleware/withLogMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { routeFx } from "~/session/location/server/fx/routeFx";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import { RouteSchema } from "~/session/location/server/schema/RouteSchema";

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
			withCatchFx({
				InvalidRequestErrorFx(error) {
					logger.error("InvalidRequestErrorFx", {
						message: error.message,
					});
					throw new Error("InvalidRequestErrorFx");
				},
				ZodErrorFx({ zod, input }) {
					logger.error("ZodError", {
						zod,
						input,
					});
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);

		return distance;
	});
