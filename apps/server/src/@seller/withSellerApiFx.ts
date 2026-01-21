import { Effect } from "effect";
import { RoutesContextFx } from "~/app/routes/RoutesContextFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { NoticeSchema } from "~/schema/NoticeSchema";

export const withSellerApiFx = Effect.fn("withSellerApiFx")(function* () {
	const { root, sellerHono } = yield* RoutesContextFx;
	const kysely = yield* KyselyContextFx;

	sellerHono.use(async (c, next) => {
		c.set("kysely", kysely);
		return next();
	});

	root.use("/api/seller/*", async (c, next) => {
		const user = c.get("user");

		if (!user) {
			return c.json<NoticeSchema.Type, 401>(
				{
					type: "error",
					message: "Shooooo! Shooo!",
				},
				401,
			);
		}
		return next();
	});

	root.route("/api/seller", sellerHono);
});
