import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";

export namespace listingFlagDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingFlagDeleteFx = ({ listingId }: listingFlagDeleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		yield* Effect.promise(async () => {
			return database
				.deleteFrom("listing_flag")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();
		});
	});
};

export type listingFlagDeleteFx = ReturnType<typeof listingFlagDeleteFx>;
