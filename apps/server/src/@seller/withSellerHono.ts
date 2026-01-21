import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";
import type { auth } from "../auth/auth";

export const withSellerHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User;
			session: auth.Session;
			kysely: KyselyContext;
		};
	}>();
};

export type withSellerHono = ReturnType<typeof withSellerHono>;
