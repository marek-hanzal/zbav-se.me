import { OpenAPIHono } from "@hono/zod-openapi";
import type { auth } from "~/auth/auth";
import type { KyselyContext } from "~/database/context/KyselyContextFx";

export const withSellerSessionHono = () => {
	return new OpenAPIHono<{
		Variables: {
			user: auth.User;
			kysely: KyselyContext;
		};
	}>();
};

export type withSellerSessionHono = ReturnType<typeof withSellerSessionHono>;
