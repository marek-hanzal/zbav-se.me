import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { favouriteFetchFx } from "~/@buyer-user/favourite/fx/favouriteFetchFx";

export namespace favouriteDeleteFx {
	export interface Props {
		userId: string;
		listingId: string;
	}
}

export const favouriteDeleteFx = Effect.fn("favouriteDeleteFx")(function* ({
	userId,
	listingId,
}: favouriteDeleteFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const favourite = yield* favouriteFetchFx({
				where: {
					listingId,
				},
				scope: {
					userId,
				},
			});

			yield* Effect.promise(async () => {
				return kysely.deleteFrom("favourite").where("id", "=", favourite.id).execute();
			});

			return favourite;
		}),
	);
});

export type favouriteDeleteFx = ReturnType<typeof favouriteDeleteFx>;
