import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";
import type { auth } from "../auth/auth";

export const withTokenHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User;
			kysely: KyselyContext;
		};
	}>();
};

export type withTokenHono = ReturnType<typeof withTokenHono>;
