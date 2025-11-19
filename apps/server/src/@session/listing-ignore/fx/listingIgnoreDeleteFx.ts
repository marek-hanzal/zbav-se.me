import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";

export namespace listingIgnoreDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingIgnoreDeleteFx = ({ listingId }: listingIgnoreDeleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		yield* Effect.promise(async () => {
			return database
				.deleteFrom("listing_ignore")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();
		});
	});
};

export type listingIgnoreDeleteFx = ReturnType<typeof listingIgnoreDeleteFx>;
