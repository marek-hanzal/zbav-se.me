import { Scalar } from "@scalar/hono-api-reference";
import type { Routes } from "~/hono/Routes";

const docsUrl = "/v3/api-docs";

export const withOpenApiEndpoint: Routes.Fn = (routes) => {
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
	});
};
