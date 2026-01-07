import { Effect } from "effect";
import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { AppEnv } from "~/AppEnv";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";

export const initMiddlewareFx = Effect.fn("initMiddleware")(function* () {
	const { root } = yield* RoutesContextFx;

	root.use(requestId());
	root.use(secureHeaders());
	root.use(
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

	root.use(
		bodyLimit({
			// We don't need to accept large large body as file uploads will be done directly to the Storage
			maxSize: 1024 * 50,
		}),
	);
});
