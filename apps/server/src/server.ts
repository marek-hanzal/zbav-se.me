import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { withPublicApi } from "./@public/withPublicApi";
import { withRootApi } from "./@root/withRootApi";
import { withSessionApi } from "./@session/withSessionApi";
import { withUserApi } from "./@user/withUserApi";
import { AppEnv } from "./AppEnv";
import { database } from "./database/kysely";
import type { Routes } from "./hono/Routes";
import { withHono } from "./hono/withHono";
import { withSessionHono } from "./hono/withSessionHono";
import { withUserHono } from "./hono/withUserHono";
import type { MessageSchema } from "./schema/MessageSchema";

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
	return c.json<MessageSchema.Type, 500>(
		{
			type: "error",
			message: err instanceof Error ? err.message : "Internal server error",
		},
		500,
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

const routes: Routes = {
	root: app,
	publicHono: withHono(),
	sessionHono: withSessionHono(),
	userHono: withUserHono(),
};

withRootApi(routes, {
	database: database.kysely,
});
withPublicApi(routes, {
	database: database.kysely,
});
withSessionApi(routes, {
	database: database.kysely,
});
withUserApi(routes, {
	database: database.kysely,
});

export default app;
