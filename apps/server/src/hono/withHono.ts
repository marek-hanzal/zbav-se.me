import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "../auth";

export const withHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user | null;
			session: typeof auth.$Infer.Session.session | null;
		};
	}>();
};

export type withHono = ReturnType<typeof withHono>;
