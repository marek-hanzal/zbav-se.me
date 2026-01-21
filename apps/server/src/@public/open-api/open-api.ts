import { Scalar } from "@scalar/hono-api-reference";
import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

const docsUrl = "/v3/api-docs";

export const withOpenApiEndpointFx = Effect.fn("withOpenApiEndpointFx")(function* () {
	const { root, publicHono, sessionHono, userHono, sellerHono, buyerHono } =
		yield* RoutesContextFx;

	root.get(
		"/",
		Scalar({
			title: "zbav.se.me API",
			pageTitle: "zbav.se.me API",
			sources: [
				{
					url: `${docsUrl}/public`,
					title: "Public",
				},
				{
					url: `${docsUrl}/session`,
					title: "Session",
				},
				{
					url: `${docsUrl}/user`,
					title: "User",
				},
				{
					url: `${docsUrl}/seller`,
					title: "Seller",
				},
				{
					url: `${docsUrl}/buyer`,
					title: "Buyer",
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
					title: "Public zbav-se.me API",
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
					title: "Protected zbav-se.me API",
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
					title: "User zbav-se.me API",
				},
				servers: [
					{
						url: viteConfig.VITE_SERVER_API,
					},
				],
				tags: [
					{
						name: "Draft",
						description: "Draft is the base (kinda template) for all listings",
					},
					{
						name: "Listing",
						description: "Listing is the base entity to work with in the app",
					},
					{
						name: "Favourite",
						description: "Favourite listing management",
					},
					{
						name: "Feed",
						description: "Feed is user setup (query) for listings",
					},
					{
						name: "Feed Favourite",
						description:
							"Feed Favourite is the collection of listings that are favourite",
					},
					{
						name: "Flag",
						description: "Listing flagging management",
					},
				],
			}),
			seller: sellerHono.getOpenAPI31Document({
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Seller zbav-se.me API",
				},
				servers: [
					{
						url: viteConfig.VITE_SERVER_API,
					},
				],
			}),
			buyer: buyerHono.getOpenAPI31Document({
				openapi: "3.1.0",
				info: {
					version: "0.5.0",
					title: "Buyer zbav-se.me API",
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
	root.get(`${docsUrl}/seller`, (c) => c.json(docs().seller));
	root.get(`${docsUrl}/buyer`, (c) => c.json(docs().buyer));

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
