import type { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";

const docsUrl = "/v3/api-docs";

export const withOpenApi = <TApi extends OpenAPIHono<any>>(api: TApi) => {
	api.get(
		"/",
		Scalar({
			url: docsUrl,
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
