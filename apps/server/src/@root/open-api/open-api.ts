import { Scalar } from "@scalar/hono-api-reference";
import { AppEnv } from "~/AppEnv";
import type { Routes } from "~/hono/Routes";

const docsUrl = "/v3/api-docs";

export const withOpenApiEndpoint: Routes.Fn = async (routes) => {
	routes.root.get(
		"/",
		Scalar({
			title: "zbav.se.me API",
			pageTitle: "zbav.se.me API",
			sources: [
				{
					url: docsUrl,
					title: "Core API",
				},
				{
					url: "/api/auth/open-api/generate-schema",
					title: "Auth",
				},
			],
		}),
	);

	routes.root.doc31(docsUrl, {
		openapi: "3.1.0",
		info: {
			version: "0.5.0",
			title: "zbav.se.me API",
		},
		servers: [
			{
				url: AppEnv.VITE_SERVER_API,
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
	});
};
