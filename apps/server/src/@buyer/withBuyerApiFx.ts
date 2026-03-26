import { Effect } from "effect";
import { UnauthorizedNotice } from "~/@common/notice/UnauthorizedNotice";
import { RoutesContextFx } from "~/route/context/RoutesContextFx";

export const withBuyerApiFx = Effect.fn("withBuyerApiFx")(function* () {
	const { root, buyerHono } = yield* RoutesContextFx;

	root.use("/api/buyer/*", async (c, next) => {
		if (!c.get("user")) {
			return c.json(UnauthorizedNotice, 401);
		}
		return next();
	});

	yield* Effect.all([
		// withTransactionApiFx(),
	]);

	root.route("/api/buyer", buyerHono);
});
