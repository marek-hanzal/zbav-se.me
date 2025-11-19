import { Effect } from "effect";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";

export namespace listingCartDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingCartDeleteFx = ({ listingId }: listingCartDeleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		yield* Effect.promise(async () => {
			return database
				.deleteFrom("listing_cart")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();
		});
	});
};

export type listingCartDeleteFx = ReturnType<typeof listingCartDeleteFx>;
