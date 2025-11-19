import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";
import { listingTransactionLogCreateFx } from "../../listing-transaction-log/service/listingTransactionLogCreateFx";

export namespace listingTransactionPatchFx {
	export interface Props {
		transactionId: string;
		status?: ListingTransactionStatusSchema.Type;
		side?: ListingTransactionSideSchema.Type;
	}
}

export const listingTransactionPatchFx = ({
	transactionId,
	status,
	side,
}: listingTransactionPatchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const transaction = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing_transaction as lt")
				.innerJoin("listing as l", "l.id", "lt.listingId")
				.select([
					"lt.id",
					"lt.userId",
					"lt.listingId",
					"lt.status",
					"lt.side",
					"l.userId as listingUserId",
				])
				.where("lt.id", "=", transactionId)
				.executeTakeFirst();
		});

		if (!transaction) {
			return yield* new NotFoundError({
				resource: "listing_transaction",
				resourceId: transactionId,
				message: "Transaction not found",
			});
		}

		if (transaction.userId !== user.id && transaction.listingUserId !== user.id) {
			return yield* new InvalidRequestError({
				message: "You are not allowed to modify this transaction",
			});
		}

		const nextStatus = status ?? transaction.status;
		const nextSide = side ?? transaction.side;
		const now = DateTime.now();

		const updated = yield* Effect.promise(async () => {
			return database
				.updateTable("listing_transaction")
				.set(() => ({
					status: nextStatus,
					side: nextSide,
					updatedAt: now.toJSDate(),
					expiresAt: now
						.plus({
							days: 3,
						})
						.toJSDate(),
					userId: user.id,
				}))
				.where("id", "=", transactionId)
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* listingTransactionLogCreateFx({
			listingTransactionId: transactionId,
			status: nextStatus,
			side: nextSide,
			createdAt: now.toJSDate(),
		});

		return updated;
	});
};

export type listingTransactionPatchFx = ReturnType<typeof listingTransactionPatchFx>;
