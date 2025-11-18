import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";

export namespace listingFlagDeleteFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
	}
}

export const listingFlagDeleteFx = ({ database, userId, listingId }: listingFlagDeleteFx.Props) => {
	return Effect.gen(function* () {
		yield* Effect.promise(async () => {
			return database
				.deleteFrom("listing_flag")
				.where("userId", "=", userId)
				.where("listingId", "=", listingId)
				.execute();
		});
	});
};

export type listingFlagDeleteFx = ReturnType<typeof listingFlagDeleteFx>;
