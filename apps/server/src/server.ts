import { Effect } from "effect";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { withPublicApiFx } from "./@public/withPublicApiFx";
import { withRootApi } from "./@root/withRootApi";
import { withSessionApiFx } from "./@session/withSessionApiFx";
import { withUserApiFx } from "./@user/withUserApiFx";
import { AppEnv } from "./AppEnv";
import { RoutesContextProvider } from "./app/routes/RoutesContextFx";
import { KyselyContextProvider } from "./database/context/KyselyContextFx";
import { database } from "./database/kysely";
import { withHono } from "./hono/withHono";
import { withSessionHono } from "./hono/withSessionHono";
import { withUserHono } from "./hono/withUserHono";
import type { NoticeSchema } from "./schema/NoticeSchema";

/**
 * Origin for CORS; uses replace hack from nitro.config.ts
 */
const app = withHono();

//
app.use(requestId());
app.use(secureHeaders());
app.use(
	cors({
		origin: [
			AppEnv.VITE_WEB_ORIGIN,
			AppEnv.VITE_APP_ORIGIN,
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
app.use(
	bodyLimit({
		// We don't need to accept large large body as file uploads will be done directly to the Storage
		maxSize: 1024 * 50,
	}),
);

app.onError((err, c) => {
	return c.json<NoticeSchema.Type, 500>(
		{
			type: "error",
			message: err instanceof Error ? err.message : "Internal server error",
		},
		500,
		{
			"X-Error-Type": "Fallback Server Error",
		},
	);
});

// const withUserRateLimiter = rateLimiter<{
// 	Variables: {
// 		user: typeof auth.$Infer.Session.user;
// 	};
// }>({
// 	store: new RedisStore({
// 		client: redis,
// 	}),
// 	/**
// 	 * 15min
// 	 */
// 	windowMs: 15 * 60 * 1000,
// 	limit: 256000,
// 	keyGenerator(c) {
// 		return `user:${c.get("user").id}`;
// 	},
// 	message: "Rate limit exceeded. Please try again later.",
// });

// app.use("/api/session/*", withUserRateLimiter);
// app.use("/api/token/*", withUserRateLimiter);

//

await Effect.all([
	withRootApi(),
	withPublicApiFx(),
	withSessionApiFx(),
	withUserApiFx(),
]).pipe(
	RoutesContextProvider({
		root: app,
		publicHono: withHono(),
		sessionHono: withSessionHono(),
		userHono: withUserHono(),
	}),
	KyselyContextProvider(database),
	Effect.runPromise,
);

export default app;
