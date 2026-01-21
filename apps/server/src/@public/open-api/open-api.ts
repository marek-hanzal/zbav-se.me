import { Scalar } from "@scalar/hono-api-reference";
import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

const docsUrl = "/v3/api-docs";

export const withOpenApiEndpointFx = Effect.fn("withOpenApiEndpointFx")(function* () {
	const { root, publicHono, sessionHono, userHono } = yield* RoutesContextFx;

	root.get(
		"/",
		Scalar({
			title: "zbav.se.me API",
			pageTitle: "zbav.se.me API",
			sources: [
				{
					url: `${docsUrl}/public`,
					title: "Public API",
				},
				{
					url: `${docsUrl}/session`,
					title: "Session API",
				},
				{
					url: `${docsUrl}/user`,
					title: "User API",
				},
				{
					url: "/api/auth/open-api/generate-schema",
					title: "Auth",
				},
			],
		}),
	);

	const viteConfig = ServerViteSchema.parse(process.env);

	const docs = () => {
		let cache = null;

		if (cache) {
			return cache;
		}

		return (cache = {
			public: publicHono.getOpenAPI31Document({
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "zbav.se.me API",
				},
				servers: [
					{
						url: viteConfig.VITE_SERVER_API,
					},
				],
			}),
			session: sessionHono.getOpenAPI31Document({
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "zbav.se.me API",
				},
				servers: [
					{
						url: viteConfig.VITE_SERVER_API,
					},
				],
			}),
			user: userHono.getOpenAPI31Document({
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "zbav.se.me API",
				},
				servers: [
					{
						url: viteConfig.VITE_SERVER_API,
					},
				],
			}),
		});
	};

	root.get(`${docsUrl}/public`, (c) => c.json(docs().public));
	root.get(`${docsUrl}/session`, (c) => c.json(docs().session));
	root.get(`${docsUrl}/user`, (c) => c.json(docs().user));

	root.doc31(docsUrl, {
		openapi: "3.1.0",
		info: {
			version: "0.5.0",
			title: "zbav.se.me API",
		},
		servers: [
			{
				url: viteConfig.VITE_SERVER_API,
			},
		],
		// @ts-expect-error - components is valid in OpenAPI 3.1 but types may not include it
		components: {
			securitySchemes: {
				cookieAuth: {
					type: "apiKey",
					in: "cookie",
					name: "better-auth.session_token",
					description: "Cookie-based authentication using better-auth session token",
				},
			},
		},
		security: [
			{
				cookieAuth: [],
			},
		],
	});
});
