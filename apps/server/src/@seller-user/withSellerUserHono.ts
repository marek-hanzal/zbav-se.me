import { OpenAPIHono } from "@hono/zod-openapi";
import type { KyselyContext } from "~/database/context/KyselyContextFx";
import type { auth } from "~/auth/auth";

export const withSellerUserHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User;
			kysely: KyselyContext;
		};
	}>();
};

export type withSellerUserHono = ReturnType<typeof withSellerUserHono>;
