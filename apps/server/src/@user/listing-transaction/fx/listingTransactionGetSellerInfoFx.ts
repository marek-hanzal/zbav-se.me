import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace listingTransactionGetSellerInfoFx {
	export interface Props {
		transactionId: string;
	}
}

export const listingTransactionGetSellerInfoFx = ({
	transactionId,
}: listingTransactionGetSellerInfoFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const userInfo = yield* Effect.promise(async () => {
			return database
				.selectFrom("user")
				.selectAll()
				.where(
					"id",
					"=",
					database
						.selectFrom("listing_transaction as lt")
						.innerJoin("listing as l", "l.id", "lt.listingId")
						.select("l.userId")
						.where("lt.id", "=", transactionId)
						.where("lt.userId", "=", user.id),
				)
				.executeTakeFirst();
		});

		if (!userInfo) {
			return yield* new NotFoundError({
				resource: "listing-transaction-seller-info",
				message: "Seller info not available",
			});
		}

		return yield* Effect.succeed({
			registered: userInfo.createdAt,
			score: 0,
		});
	});
};

export type listingTransactionGetSellerInfoFx = ReturnType<
	typeof listingTransactionGetSellerInfoFx
>;
