import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { UserContextFx } from "../../../auth/UserContextFx";
import { listingIgnoreFetchFx } from "./listingIgnoreFetchFx";

export namespace listingIgnoreDeleteFx {
	export interface Props {
		listingId: string;
	}
}

export const listingIgnoreDeleteFx = ({ listingId }: listingIgnoreDeleteFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;

			const ignore = yield* listingIgnoreFetchFx({
				query: {
					where: {
						listingId,
						userId: user.id,
					},
				},
			});

			yield* Effect.tryPromise(async () => {
				return database
					.deleteFrom("listing_ignore")
					.where("userId", "=", user.id)
					.where("listingId", "=", listingId)
					.execute();
			});

			return ignore;
		}),
	);
};

export type listingIgnoreDeleteFx = ReturnType<typeof listingIgnoreDeleteFx>;
