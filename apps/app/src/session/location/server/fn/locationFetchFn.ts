import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { locationFetchFx } from "~/session/location/server/fx/locationFetchFx";
import { LocationQuerySchema } from "~/session/location/server/schema/LocationQuerySchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const locationFetchFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(LocationQuerySchema)
	.handler(async ({ data, context: { database } }) => {
		return zodGuardFx({
			schema: LocationSchema,
			dataFx: locationFetchFx({
				...data,
			}),
		}).pipe(
			withKyselyFx(database),
			withCatchFx({
				NotFoundErrorFx() {
					throw new Error("NotFoundError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
