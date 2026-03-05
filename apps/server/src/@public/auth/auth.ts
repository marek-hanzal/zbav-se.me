import { oAuthDiscoveryMetadata, oAuthProtectedResourceMetadata } from "better-auth/plugins";
import { Effect } from "effect";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withAuthEndpointFx = Effect.fn("withAuthEndpointFx")(function* () {
	const { root } = yield* RoutesContextFx;
	const { dialect } = yield* KyselyContextFx;

	const authApi = auth(() => dialect, {
		basePath: "/api/auth",
	});
	const oauthApi = auth(() => dialect, {
		basePath: "/api/oauth",
	});
	const { handler: withAuthHandler } = authApi;
	const { handler: withOauthHandler } = oauthApi;
	const withDiscovery = oAuthDiscoveryMetadata(oauthApi);
	const withProtectedResource = oAuthProtectedResourceMetadata(oauthApi);

	root.on(
		[
			"POST",
			"GET",
		],
		"/api/auth/*",
		(c) => withAuthHandler(c.req.raw),
	);

	root.on(
		[
			"POST",
			"GET",
		],
		"/api/oauth/*",
		(c) => withOauthHandler(c.req.raw),
	);

	root.get("/.well-known/oauth-authorization-server", (c) => {
		return withDiscovery(c.req.raw);
	});

	root.get("/.well-known/oauth-authorization-server/*", (c) => {
		return withDiscovery(c.req.raw);
	});

	root.get("/.well-known/openid-configuration", (c) => {
		return withDiscovery(c.req.raw);
	});

	root.get("/.well-known/openid-configuration/*", (c) => {
		return withDiscovery(c.req.raw);
	});

	root.get("/.well-known/oauth-protected-resource", (c) => {
		return withProtectedResource(c.req.raw);
	});

	root.get("/.well-known/oauth-protected-resource/*", (c) => {
		return withProtectedResource(c.req.raw);
	});

	root.get("/api/oauth/.well-known/oauth-authorization-server", (c) => {
		return withDiscovery(c.req.raw);
	});

	root.get("/api/oauth/.well-known/openid-configuration", (c) => {
		return withDiscovery(c.req.raw);
	});

	root.get("/api/oauth/.well-known/oauth-protected-resource", (c) => {
		return withProtectedResource(c.req.raw);
	});
});
