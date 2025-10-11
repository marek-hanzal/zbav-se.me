import { Hono } from "hono";

const app = new Hono();
app.get("/health", (c) =>
	c.json({
		status: true,
	}),
);
app.all("*", (c) => c.text("Ahoj pyčo!"));

export default app;
