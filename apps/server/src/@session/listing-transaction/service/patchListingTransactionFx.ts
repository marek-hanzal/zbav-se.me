import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InvalidRequestError } from "../../../error/InvalidRequestError";
import { NotFoundError } from "../../../error/NotFoundError";

export namespace patchListingTransactionFx {
	export interface Props {
		database: WithDatabase;
		transactionId: string;
		userId: string;
		status?: ListingTransactionStatusSchema.Type;
		side?: ListingTransactionSideSchema.Type;
	}
}

export const patchListingTransactionFx = ({
	database,
	transactionId,
	userId,
	status,
	side,
}: patchListingTransactionFx.Props) => {
	return Effect.gen(function* () {
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
			return yield* Effect.fail(
				new NotFoundError({
					resource: "listing_transaction",
					resourceId: transactionId,
					message: "Transaction not found",
				}),
			);
		}

		if (transaction.userId !== userId && transaction.listingUserId !== userId) {
			return yield* Effect.fail(
				new InvalidRequestError({
					message: "You are not allowed to modify this transaction",
				}),
			);
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
					userId,
				}))
				.where("id", "=", transactionId)
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* Effect.promise(async () => {
			return database
				.insertInto("listing_transaction_log")
				.values({
					id: genId(),
					listingTransactionId: transactionId,
					status: nextStatus,
					side: nextSide,
					createdAt: now.toJSDate(),
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		return updated;
	});
};

export type patchListingTransactionFx = ReturnType<typeof patchListingTransactionFx>;
