import { Effect } from "effect";
import type { ListingTransactionStatusAcceptSchema } from "~/@user/listing-transaction/@status/schema/ListingTransactionStatusAcceptSchema";
import { listingTransactionStatusCreateFx } from "~/@user/listing-transaction-status/fx/listingTransactionStatusCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { AccessDeniedError } from "~/error/AccessDeniedError";

export namespace listingTransactionStatusAcceptFx {
	export type Props = ListingTransactionStatusAcceptSchema.Type;
}

export const listingTransactionStatusAcceptFx = ({
	listingTransactionId,
}: listingTransactionStatusAcceptFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const transaction = yield* Effect.tryPromise(async () => {
			return (
				database
					.selectFrom("listing_transaction as lt")
					.innerJoin("listing as l", "lt.listingId", "l.id")
					.select([
						"l.userId as sellerId",
						"lt.userId as buyerId",
					])
					/**
					 * For which transaction we want to create status
					 */
					.where("lt.id", "=", listingTransactionId)
					/**
					 * We've to check if current user is on either side of the transaction
					 */
					.where((eb) => {
						return eb.or([
							eb("lt.userId", "=", user.id),
							eb("l.userId", "=", user.id),
						]);
					})
					.executeTakeFirst()
			);
		});

		if (!transaction) {
			return yield* new AccessDeniedError({
				message: "You are not allowed to accept this listing transaction",
			});
		}

		return yield* listingTransactionStatusCreateFx({
			listingTransactionId,
			status: "accepted",
			side: transaction.buyerId === user.id ? "buyer" : "seller",
		});
	});
};

export type listingTransactionStatusAcceptFx = ReturnType<typeof listingTransactionStatusAcceptFx>;
