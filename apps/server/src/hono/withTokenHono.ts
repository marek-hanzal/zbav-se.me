import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "../auth";

export const withTokenHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user;
		};
	}>();
};

export type withTokenHono = ReturnType<typeof withTokenHono>;
