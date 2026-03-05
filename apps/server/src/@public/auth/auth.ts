import { oAuthDiscoveryMetadata, oAuthProtectedResourceMetadata } from "better-auth/plugins";
import { Effect } from "effect";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withAuthEndpointFx = Effect.fn("withAuthEndpointFx")(function* () {
	const { root } = yield* RoutesContextFx;
	const { dialect } = yield* KyselyContextFx;

	const authApi = auth(() => dialect);
	const { handler } = authApi;
	const withDiscovery = oAuthDiscoveryMetadata(authApi);
	const withProtectedResource = oAuthProtectedResourceMetadata(authApi);

	root.on(
		[
			"POST",
			"GET",
		],
		"/api/auth/*",
		(c) => handler(c.req.raw),
	);

	root.get("/.well-known/oauth-authorization-server", (c) => {
		return withDiscovery(c.req.raw);
	});

	root.get("/.well-known/oauth-protected-resource", (c) => {
		return withProtectedResource(c.req.raw);
	});
});
