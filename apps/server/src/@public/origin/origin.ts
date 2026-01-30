import { Effect } from "effect";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

export const withOriginEndpointFx = Effect.fn("withOriginEndpointFx")(function* () {
	const { root } = yield* RoutesContextFx;

	root.get("/origin", (c) => {
		const viteConfig = ServerViteSchema.parse(process.env);

		return c.json({
			origin: [
				viteConfig.VITE_WEB_ORIGIN,
				viteConfig.VITE_APP_ORIGIN,
				...(viteConfig.VITE_ARKINI_ORIGIN ? [viteConfig.VITE_ARKINI_ORIGIN] : []),
			],
		});
	});
});
