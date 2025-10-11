import { defineEventHandler, toWebRequest } from "h3";
import { Hono } from "hono";

const app = new Hono();

app.all("*", (c) => c.text("Ahoj pyco!"));

export default defineEventHandler(async (event) => {
	return app.fetch(toWebRequest(event));
});
