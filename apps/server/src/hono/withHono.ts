import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "~/auth/auth";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User | null;
			kysely: KyselyContext;
			traceId: string;
		};
	}>();
};

export type withHono = ReturnType<typeof withHono>;
