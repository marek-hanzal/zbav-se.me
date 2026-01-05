import { OpenAPIHono } from "@hono/zod-openapi";
import type { Kysely } from "kysely";
import type { auth } from "../auth/auth";
import type { Database } from "../database/Database";

export const withHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User | null;
			session: auth.Session | null;
			database: Kysely<Database>;
		};
	}>();
};

export type withHono = ReturnType<typeof withHono>;
