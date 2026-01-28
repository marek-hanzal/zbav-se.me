import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";
import type { auth } from "~/auth/auth";

export const withHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User | null;
			kysely: KyselyContext;
		};
	}>();
};

export type withHono = ReturnType<typeof withHono>;
