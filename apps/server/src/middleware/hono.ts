import { defineEventHandler, toWebRequest } from "h3";
import { Hono } from "hono";

const app = new Hono();
app.all("*", (c) => c.text("Ahoj pyčo!"));

export default defineEventHandler((event) => app.fetch(toWebRequest(event)));
