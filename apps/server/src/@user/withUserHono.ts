import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";
import type { auth } from "../auth/auth";

export const withUserHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User;
			session: auth.Session;
			kysely: KyselyContext;
		};
	}>();
};

export type withUserHono = ReturnType<typeof withUserHono>;
