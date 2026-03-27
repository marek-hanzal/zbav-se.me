import { createServerFn } from "@tanstack/react-start";
import { zodGuardFx } from "@use-pico/common/schema";
import { Effect } from "effect";
import { z } from "zod";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withCatchFx } from "~/server/effect/withCatchFx";
import { ServerGeoapifySchema } from "~/server/env/ServerGeoapifySchema";
import { withDatabaseMiddleware } from "~/server/middleware/withDatabaseMiddleware";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { locationAutocompleteFx } from "~/session/location/server/fx/locationAutocompleteFx";
import { withLocationFx } from "~/session/location/server/fx/withLocationFx";
import { LocationAutocompleteSchema } from "~/session/location/server/schema/LocationAutocompleteSchema";
import { LocationSchema } from "~/session/location/server/schema/LocationSchema";

export const locationAutocompleteFn = createServerFn()
	.middleware([
		withDatabaseMiddleware,
		withUserMiddleware,
	])
	.inputValidator(LocationAutocompleteSchema)
	.handler(async ({ data, context: { database } }) => {
		const geoapifyConfig = ServerGeoapifySchema.parse(process.env);

		return zodGuardFx({
			schema: z.array(LocationSchema),
			dataFx: locationAutocompleteFx({
				...data,
			}),
		}).pipe(
			withKyselyFx(database),
			withLocationFx({
				geoapifyToken: geoapifyConfig.SERVER_GEOAPIFY_TOKEN,
				api: "https://api.geoapify.com",
				autocomplete: "/v1/geocode/autocomplete",
			}),
			withCatchFx({
				TextTooShortErrorFx() {
					return [];
				},
				RuntimeErrorFx() {
					throw new Error("RuntimeError");
				},
				ZodErrorFx() {
					throw new Error("ZodError");
				},
			}),
			Effect.runPromise,
		);
	});
