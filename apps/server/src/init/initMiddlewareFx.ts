import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { match } from "ts-pattern";
import { withLoggingFx } from "~/@common/axiom/fx/withLoggingFx";
import type { auth as authType } from "~/auth/auth";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";
import { ServerAxiomSchema } from "~/schema/env/ServerAxiomSchema";
import { ServerViteSchema } from "~/schema/env/ServerViteSchema";

const withAuthorizationToken = (headers: Headers): null | string => {
	const authorization = headers.get("authorization");
	const bearerPrefix = "Bearer ";

	if (!authorization || !authorization.startsWith(bearerPrefix)) {
		return null;
	}

	return authorization.slice(bearerPrefix.length).trim();
};

export namespace withAuthLog {
	export interface Props {
		hasAuthorization: boolean;
		hasUser: boolean;
		level: "error" | "info" | "warning";
		method: string;
		path: string;
		reason: string;
		source: "anonymous" | "bearer" | "mcp-session" | "session" | "unknown";
		traceId: string;
		userAgent: string;
	}
}

const withAuthLog = async (axiomConfig: ServerAxiomSchema.Type, props: withAuthLog.Props) => {
	const logFx = match(props.level)
		.with("warning", () => Effect.logWarning("auth.resolve"))
		.with("error", () => Effect.logError("auth.resolve"))
		.otherwise(() => Effect.log("auth.resolve"));

	await logFx
		.pipe(
			Effect.annotateLogs({
				hasAuthorization: props.hasAuthorization,
				hasUser: props.hasUser,
				method: props.method,
				path: props.path,
				reason: props.reason,
				source: props.source,
				userAgent: props.userAgent,
			}),
			withLoggingFx(axiomConfig, "auth.resolve", props.traceId),
			Effect.runPromise,
		)
		.catch(() => undefined);
};

export const initMiddlewareFx = Effect.fn("initMiddleware")(function* () {
	const { root } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	const axiomConfig = ServerAxiomSchema.parse(process.env);
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

	root.use(async (c, next) => {
		c.set("traceId", genId());
		return next();
	});
	root.use(async (c, next) => {
		const startedAt = Date.now();

		await next();

		const status = c.res.status;
		const message =
			status >= 500
				? "http.response.error"
				: status >= 400
					? "http.response.warn"
					: "http.response.info";
		const logFx =
			status >= 500
				? Effect.logError(message)
				: status >= 400
					? Effect.logWarning(message)
					: Effect.log(message);

		await logFx
			.pipe(
				Effect.annotateLogs({
					durationMs: Date.now() - startedAt,
					hasAuthorization: Boolean(c.req.header("authorization")),
					hasUser: Boolean(c.get("user")),
					method: c.req.method,
					path: c.req.path,
					status,
					userAgent: c.req.header("user-agent") ?? "",
				}),
				withLoggingFx(axiomConfig, "http.response", c.get("traceId")),
				Effect.runPromise,
			)
			.catch(() => undefined);
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
				const token = withAuthorizationToken(c.req.raw.headers);

				if (!token) {
					await withAuthLog({
						hasAuthorization: Boolean(c.req.header("authorization")),
						hasUser: false,
						level: "warning",
						method: c.req.method,
						path: c.req.path,
						reason: "no-token",
						source: "anonymous",
						traceId: c.get("traceId"),
						userAgent: c.req.header("user-agent") ?? "",
					});
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
						await withAuthLog({
							hasAuthorization: Boolean(c.req.header("authorization")),
							hasUser: false,
							level: "warning",
							method: c.req.method,
							path: c.req.path,
							reason: "mcp-session-user-not-found",
							source: "mcp-session",
							traceId: c.get("traceId"),
							userAgent: c.req.header("user-agent") ?? "",
						});
						c.set("user", null);
						return next();
					}

					await withAuthLog({
						hasAuthorization: Boolean(c.req.header("authorization")),
						hasUser: true,
						level: "info",
						method: c.req.method,
						path: c.req.path,
						reason: "mcp-session-user",
						source: "mcp-session",
						traceId: c.get("traceId"),
						userAgent: c.req.header("user-agent") ?? "",
					});
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
					await withAuthLog({
						hasAuthorization: Boolean(c.req.header("authorization")),
						hasUser: false,
						level: "warning",
						method: c.req.method,
						path: c.req.path,
						reason: "bearer-user-not-found",
						source: "bearer",
						traceId: c.get("traceId"),
						userAgent: c.req.header("user-agent") ?? "",
					});
					c.set("user", null);
					return next();
				}

				await withAuthLog({
					hasAuthorization: Boolean(c.req.header("authorization")),
					hasUser: true,
					level: "info",
					method: c.req.method,
					path: c.req.path,
					reason: "bearer-user",
					source: "bearer",
					traceId: c.get("traceId"),
					userAgent: c.req.header("user-agent") ?? "",
				});
				c.set("user", mcpUser as authType.User);
				return next();
			}
			await withAuthLog({
				hasAuthorization: Boolean(c.req.header("authorization")),
				hasUser: true,
				level: "info",
				method: c.req.method,
				path: c.req.path,
				reason: "session-user",
				source: "session",
				traceId: c.get("traceId"),
				userAgent: c.req.header("user-agent") ?? "",
			});
			c.set("user", session.user);
			return next();
		} catch {
			await withAuthLog({
				hasAuthorization: Boolean(c.req.header("authorization")),
				hasUser: false,
				level: "error",
				method: c.req.method,
				path: c.req.path,
				reason: "auth-runtime-error",
				source: "unknown",
				traceId: c.get("traceId"),
				userAgent: c.req.header("user-agent") ?? "",
			});
			c.set("user", null);
			return next();
		}
	});
});
