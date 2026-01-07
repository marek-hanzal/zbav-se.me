import { Effect } from "effect";
import { withAuthApiFx } from "~/@root/auth/withAuthApiFx";
import { withCorsApiFx } from "~/@root/cors/withCorsApiFx";
import { withOpenApiApiFx } from "~/@root/open-api/withOpenApiApiFx";
import { withOriginApiFx } from "~/@root/origin/withOriginApiFx";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { auth } from "~/auth/auth";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export const withRootApi = Effect.fn("withRootApi")(function* () {
	const { root } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	root.use(async (c, next) => {
		c.set("kysely", kysely);

		const { api } = auth(() => kysely.dialect());

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
