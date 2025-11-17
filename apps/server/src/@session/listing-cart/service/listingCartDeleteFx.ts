import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";

export namespace listingCartDeleteFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
	}
}

export const listingCartDeleteFx = ({ database, userId, listingId }: listingCartDeleteFx.Props) => {
	return Effect.gen(function* () {
		yield* Effect.promise(async () => {
			return database
				.deleteFrom("listing_cart")
				.where("userId", "=", userId)
				.where("listingId", "=", listingId)
				.execute();
		});
	});
};

export type listingCartDeleteFx = ReturnType<typeof listingCartDeleteFx>;
