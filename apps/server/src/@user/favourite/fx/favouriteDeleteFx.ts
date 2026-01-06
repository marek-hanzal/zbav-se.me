import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { favouriteFetchFx } from "./favouriteFetchFx";

export namespace favouriteDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const favouriteDeleteFx = Effect.fn("favouriteDeleteFx")(function* ({
	listingId,
}: favouriteDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const favourite = yield* favouriteFetchFx({
				where: {
					listingId,
					userId: user.id,
				},
			});

			yield* Effect.promise(async () => {
				return database
					.deleteFrom("favourite")
					.where("userId", "=", user.id)
					.where("listingId", "=", listingId)
					.execute();
			});

			return favourite;
		}),
	);
});

export type favouriteDeleteFx = ReturnType<typeof favouriteDeleteFx>;
