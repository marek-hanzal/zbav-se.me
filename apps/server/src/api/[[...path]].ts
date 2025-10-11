import { Hono } from "hono";
import { handle } from "hono/vercel";

export const config = {
	runtime: "nodejs20.x",
};

const app = new Hono();

app.all("/*", (c) => c.text("Ahoj pyco!"));

export default handle(app);
