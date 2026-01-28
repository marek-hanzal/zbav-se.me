import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";
import type { auth } from "../auth/auth";

export const withPublicHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User | null;
			kysely: KyselyContext;
		};
	}>();
};

export type withPublicHono = ReturnType<typeof withPublicHono>;
