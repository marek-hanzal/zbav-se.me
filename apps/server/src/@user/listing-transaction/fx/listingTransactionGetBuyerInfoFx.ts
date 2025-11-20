import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace listingTransactionGetBuyerInfoFx {
	export interface Props {
		transactionId: string;
	}
}

export const listingTransactionGetBuyerInfoFx = ({
	transactionId,
}: listingTransactionGetBuyerInfoFx.Props) => {
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
						.select("lt.userId")
						.where("lt.id", "=", transactionId)
						/**
						 * Technically even buyer can see his own data, but for sake of security hardness,
						 * we keep only seller's point of view.
						 */
						.where("l.userId", "=", user.id),
				)
				.executeTakeFirst();
		});

		if (!userInfo) {
			return yield* new NotFoundError({
				resource: "listing-transaction-buyer-info",
				message: "Buyer info not available",
			});
		}

		return yield* Effect.succeed({
			registered: userInfo.createdAt,
			score: 0,
		});
	});
};

export type listingTransactionGetBuyerInfoFx = ReturnType<typeof listingTransactionGetBuyerInfoFx>;
