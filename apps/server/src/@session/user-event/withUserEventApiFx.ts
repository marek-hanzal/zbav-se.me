import { Effect } from "effect";
import { withBuyerApiFx } from "./buyer";
import { withSellerApiFx } from "./seller";

export const withUserEventApiFx = Effect.fn("withUserEventApiFx")(function* () {
	yield* Effect.all([
		withBuyerApiFx(),
		withSellerApiFx(),
	]);
});
