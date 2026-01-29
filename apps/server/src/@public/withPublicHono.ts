import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "~/auth/auth";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withPublicHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User | null;
			kysely: KyselyContext;
		};
	}>();
};

export type withPublicHono = ReturnType<typeof withPublicHono>;
