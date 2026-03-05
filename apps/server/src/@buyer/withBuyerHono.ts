import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "~/auth/auth";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withBuyerHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User;
			kysely: KyselyContext;
			traceId: string;
		};
	}>();
};

export type withBuyerHono = ReturnType<typeof withBuyerHono>;
