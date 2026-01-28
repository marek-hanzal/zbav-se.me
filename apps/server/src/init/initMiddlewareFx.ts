import { Effect } from "effect";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/routes/context/RoutesContextFx";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

export const initMiddlewareFx = Effect.fn("initMiddleware")(function* () {
	const { root } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	const viteConfig = ServerViteSchema.parse(process.env);

	root.use(requestId());
	root.use(secureHeaders());
	root.use(
		cors({
			origin: [
				viteConfig.VITE_WEB_ORIGIN,
				viteConfig.VITE_APP_ORIGIN,
			],
			allowHeaders: [
				"User-Agent",
				"Content-Type",
				"Authorization",
			],
			allowMethods: [
				"GET",
				"POST",
				"PUT",
				"DELETE",
				"PATCH",
				"OPTIONS",
			],
			exposeHeaders: [
				"Content-Length",
				"X-Request-Id",
			],
			maxAge: 600,
			credentials: true,
		}),
	);
	root.use(
		bodyLimit({
			// We don't need to accept large large body as file uploads will be done directly to the Storage
			maxSize: 1024 * 50,
		}),
	);
	root.use(async (c, next) => {
		c.set("kysely", kysely);

		const { api } = auth(() => kysely.dialect);

		try {
			const session = await api.getSession({
				headers: c.req.raw.headers,
			});
			if (!session) {
				c.set("user", null);
				return next();
			}
			c.set("user", session.user);
			return next();
		} catch {
			c.set("user", null);
			return next();
		}
	});
});
