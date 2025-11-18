import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";

export namespace listingIgnoreDeleteFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
	}
}

export const listingIgnoreDeleteFx = ({
	database,
	userId,
	listingId,
}: listingIgnoreDeleteFx.Props) => {
	return Effect.gen(function* () {
		yield* Effect.promise(async () => {
			return database
				.deleteFrom("listing_ignore")
				.where("userId", "=", userId)
				.where("listingId", "=", listingId)
				.execute();
		});
	});
};

export type listingIgnoreDeleteFx = ReturnType<typeof listingIgnoreDeleteFx>;
