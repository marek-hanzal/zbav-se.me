import { Effect } from "effect";
import { UnauthorizedNotice } from "~/@common/notice/UnauthorizedNotice";
import { withLocationApiFx } from "~/@session/location/withLocationApiFx";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withSessionApiFx = Effect.fn("withSessionApiFx")(function* () {
	const { root, sessionHono } = yield* RoutesContextFx;

	root.use("/api/session/*", async (c, next) => {
		if (!c.get("user")) {
			return c.json(UnauthorizedNotice, 401);
		}

		return next();
	});

	yield* Effect.all([
		// withLocationApiFx(),
	]);

	root.route("/api/session", sessionHono);
});
