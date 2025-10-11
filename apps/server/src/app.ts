import { OpenAPIHono } from "@hono/zod-openapi";
import { Scalar } from "@scalar/hono-api-reference";
import { healthRoute } from "./route/healthRoute";

const app = new OpenAPIHono();
app.openapi(healthRoute, (c) => {
	return c.json({
		status: true,
	});
});
app.get(
	"/docs",
	Scalar({
		url: "/openapi.json",
	}),
);

app.doc("/openapi.json", {
	openapi: "3.0.0",
	info: {
		version: "0.5.0",
		title: "zbav.se.me API",
	},
});

app.all("*", (c) => c.text("Ahoj pyčo!"));

export default app;
