import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { listingCartFetchFx } from "./listingCartFetchFx";

export namespace listingCartDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingCartDeleteFx = ({ listingId }: listingCartDeleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const cart = yield* listingCartFetchFx({
			query: {
				where: {
					listingId,
					userId: user.id,
				},
			},
		});

		yield* Effect.tryPromise(async () => {
			return database
				.deleteFrom("listing_cart")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();
		});

		return cart;
	});
};

export type listingCartDeleteFx = ReturnType<typeof listingCartDeleteFx>;
