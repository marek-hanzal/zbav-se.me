import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { listingCartFetchFx } from "./listingCartFetchFx";

export namespace listingCartDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingCartDeleteFx = ({ listingId }: listingCartDeleteFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
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
					.deleteFrom("favorite")
					.where("userId", "=", user.id)
					.where("listingId", "=", listingId)
					.execute();
			});

			return cart;
		}),
	);
};

export type listingCartDeleteFx = ReturnType<typeof listingCartDeleteFx>;
