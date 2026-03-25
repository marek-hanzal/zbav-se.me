import { Effect } from "effect";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import type { auth as authType } from "~/auth/auth";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerDebugSchema } from "~/schema/env/ServerDebugSchema";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

const withAuthorizationToken = (headers: Headers): null | string => {
	const authorization = headers.get("authorization");
	const bearerPrefix = "Bearer ";

	if (!authorization?.startsWith(bearerPrefix)) {
		return null;
	}

	return authorization.slice(bearerPrefix.length).trim();
};

export const initMiddlewareFx = Effect.fn("initMiddleware")(function* () {
	const { root } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	const debugConfig = ServerDebugSchema.parse(process.env);
	const viteConfig = ServerViteSchema.parse(process.env);
	const withOpenCors = cors({
		origin: "*",
		allowHeaders: [
			"User-Agent",
			"Content-Type",
			"Authorization",
			"Mcp-Protocol-Version",
			"Last-Event-ID",
		],
		allowMethods: [
			"GET",
			"POST",
			"DELETE",
			"OPTIONS",
		],
		exposeHeaders: [
			"Content-Length",
			"X-Request-Id",
			"WWW-Authenticate",
			"Mcp-Session-Id",
			"Mcp-Protocol-Version",
		],
		maxAge: 600,
		credentials: false,
	});

	root.use(requestId());
	root.use(secureHeaders());
	root.use("/api/mcp", withOpenCors);
	root.use("/api/mcp/*", withOpenCors);
	root.use("/api/oauth/mcp/*", withOpenCors);
	root.use("/.well-known/*", withOpenCors);
	root.use("/api/oauth/.well-known/*", withOpenCors);
	root.use(
		cors({
			origin: [
				viteConfig.VITE_ORIGIN,
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
	root.use("/api/*", async (_c, next) => {
		if (debugConfig.SERVER_DEBUG_DELAY_MS > 0) {
			await new Promise((resolve) => {
				setTimeout(resolve, debugConfig.SERVER_DEBUG_DELAY_MS);
			});
		}

		return next();
	});
	root.use(async (c, next) => {
		c.set("kysely", kysely);

		const { api } = auth(() => kysely.dialect);

		try {
			const session = await api.getSession({
				headers: c.req.raw.headers,
			});
			if (!session) {
				const token = withAuthorizationToken(c.req.raw.headers);

				if (!token) {
					c.set("user", null);
					return next();
				}

				const mcpSession = await api.getMcpSession({
					headers: c.req.raw.headers,
				});

				if (mcpSession) {
					const mcpOauthUser = await kysely.kysely
						.selectFrom("user_ex")
						.innerJoin("user", "user.id", "user_ex.userId")
						.selectAll("user")
						.select([
							"user_ex.locationId as locationId",
							"user_ex.side as side",
						])
						.where("user.id", "=", mcpSession.userId)
						.executeTakeFirst();

					if (!mcpOauthUser) {
						c.set("user", null);
						return next();
					}

					c.set("user", mcpOauthUser as authType.User);
					return next();
				}

				const mcpUser = await kysely.kysely
					.selectFrom("user_ex")
					.innerJoin("user", "user.id", "user_ex.userId")
					.selectAll("user")
					.select([
						"user_ex.locationId as locationId",
						"user_ex.side as side",
					])
					.where("user_ex.token", "=", token)
					.executeTakeFirst();

				if (!mcpUser) {
					c.set("user", null);
					return next();
				}

				c.set("user", mcpUser as authType.User);
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
