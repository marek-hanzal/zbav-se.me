import { Effect } from "effect";
import { AppEnv } from "~/AppEnv";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";

export const withOriginEndpointFx = Effect.fn("withOriginEndpointFx")(function* () {
	const { root } = yield* RoutesContextFx;

	root.get("/origin", (c) =>
		c.json({
			origin: [
				AppEnv.VITE_WEB_ORIGIN,
				AppEnv.VITE_APP_ORIGIN,
			],
		}),
	);
});
