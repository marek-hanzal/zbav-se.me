import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "../auth";

export const withTokenHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user;
			session: typeof auth.$Infer.Session.session;
		};
	}>();
};

export type withTokenHono = ReturnType<typeof withTokenHono>;
