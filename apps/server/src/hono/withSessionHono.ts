import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "../auth";

export const withSessionHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user;
			session: typeof auth.$Infer.Session.session;
		};
	}>();
};

export type withSessionHono = ReturnType<typeof withSessionHono>;
