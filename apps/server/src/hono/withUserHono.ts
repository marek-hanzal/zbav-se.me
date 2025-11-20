import { OpenAPIHono } from "@hono/zod-openapi";
import type { Kysely } from "kysely";
import type { auth } from "../auth/auth";
import type { Database } from "../database/Database";

export const withUserHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: typeof auth.$Infer.Session.user;
			database: Kysely<Database>;
		};
	}>();
};

export type withUserHono = ReturnType<typeof withUserHono>;
