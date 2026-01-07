import { Effect } from "effect";
import { withOriginApiFx } from "~/@root/origin/withOriginApiFx";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { dialect } from "~/database/dialect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { auth } from "../auth/auth";
import { withAuthApiFx } from "./auth/withAuthApiFx";
import { withCorsApiFx } from "./cors/withCorsApiFx";
import { withOpenApiApiFx } from "./open-api/withOpenApiApiFx";

export const withRootApi = Effect.fn("withRootApi")(function* () {
	const { root } = yield* RoutesContextFx;
	const database = yield* DatabaseContextFx;

	root.use(async (c, next) => {
		c.set("database", database);

		const { api } = auth(() => dialect);

		try {
			const session = await api.getSession({
				headers: c.req.raw.headers,
			});
			if (!session) {
				c.set("user", null);
				c.set("session", null);
				return next();
			}
			c.set("user", session.user);
			c.set("session", session.session);
			return next();
		} catch {
			c.set("user", null);
			c.set("session", null);
			return next();
		}
	});

	yield* Effect.all([
		withAuthApiFx(),
		withCorsApiFx(),
		withOpenApiApiFx(),
		withOriginApiFx(),
	]);
});
