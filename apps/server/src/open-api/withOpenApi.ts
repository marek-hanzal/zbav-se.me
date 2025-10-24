import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

const docsUrl = "/v3/api-docs";

export const withOpenApi = <TApi extends OpenAPIHono<any>>(api: TApi) => {
	api.get(
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
	api.doc(docsUrl, {
		openapi: "3.0.0",
		info: {
			version: "0.5.0",
			title: "zbav.se.me API",
		},
	});

	return api;
};
