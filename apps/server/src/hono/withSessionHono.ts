import { OpenAPIHono } from "@hono/zod-openapi";
import type { Kysely } from "kysely";
import type { auth } from "../auth/auth";
import type { Database } from "../database/Database";

export const withSessionHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user;
			session: typeof auth.$Infer.Session.session;
			database: Kysely<Database>;
		};
	}>();
};

export type withSessionHono = ReturnType<typeof withSessionHono>;
