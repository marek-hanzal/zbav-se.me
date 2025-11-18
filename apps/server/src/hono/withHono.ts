import { OpenAPIHono } from "@hono/zod-openapi";
import type { Kysely } from "kysely";
import type { auth } from "../auth/auth";
import type { Database } from "../database/Database";

export const withHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user | null;
			session: typeof auth.$Infer.Session.session | null;
			database: Kysely<Database>;
		};
	}>();
};

export type withHono = ReturnType<typeof withHono>;
