import { Effect } from "effect";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace listingGetSellerInfoFx {
	export interface Props {
		listingId: string;
	}
}

export const listingGetSellerInfoFx = ({ listingId }: listingGetSellerInfoFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const seller = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("user")
				.selectAll()
				.where(
					"id",
					"=",
					database.selectFrom("listing").select("userId").where("id", "=", listingId),
				)
				.executeTakeFirst();
		});

		if (!seller) {
			return yield* new NotFoundError({
				resource: "listing-seller-info",
				message: "Seller info not available",
			});
		}

		return yield* Effect.succeed({
			registered: seller.createdAt,
			score: 0,
		});
	});
};

export type listingGetSellerInfoFx = ReturnType<typeof listingGetSellerInfoFx>;
