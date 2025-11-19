import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { listingFlagFetchFx } from "./listingFlagFetchFx";

export namespace listingFlagDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingFlagDeleteFx = ({ listingId }: listingFlagDeleteFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const flag = yield* listingFlagFetchFx({
			query: {
				where: {
					listingId,
					userId: user.id,
				},
			},
		});

		yield* Effect.tryPromise(async () => {
			return database
				.deleteFrom("listing_flag")
				.where("userId", "=", user.id)
				.where("listingId", "=", listingId)
				.execute();
		});

		return flag;
	});
};

export type listingFlagDeleteFx = ReturnType<typeof listingFlagDeleteFx>;
