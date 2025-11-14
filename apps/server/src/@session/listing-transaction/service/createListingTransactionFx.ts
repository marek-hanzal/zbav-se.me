import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import type { WithDatabase } from "../../../database/WithDatabase";
import { InfraError } from "../../../error/InfraError";
import { NotFoundError } from "../../../error/NotFoundError";

export namespace createListingTransactionFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
	}
}

export const createListingTransactionFx = ({
	database,
	userId,
	listingId,
}: createListingTransactionFx.Props) => {
	return Effect.gen(function* () {
		const listing = yield* Effect.tryPromise({
			try: () =>
				database
					.selectFrom("listing")
					.select([
						"id",
						"userId",
					])
					.where("id", "=", listingId)
					.executeTakeFirst(),
			catch: (error) =>
				new InfraError({
					type: "database",
					message: error instanceof Error ? error.message : "Unknown error",
				}),
		});

		if (!listing) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "listing",
					resourceId: listingId,
					message: "Listing not found",
				}),
			);
		}

		const side: ListingTransactionSideSchema.Type = "buyer";
		const status: ListingTransactionStatusSchema.Type = "request";
		const now = DateTime.now();
		const expiresAt = now.plus({
			days: 3,
		});
		const nowDate = now.toJSDate();
		const expiresAtDate = expiresAt.toJSDate();

		const transaction = yield* Effect.tryPromise({
			try: () =>
				database
					.insertInto("listing_transaction")
					.values({
						id: genId(),
						userId,
						listingId,
						status,
						side,
						createdAt: nowDate,
						updatedAt: nowDate,
						expiresAt: expiresAtDate,
					})
					.returningAll()
					.executeTakeFirstOrThrow(),
			catch: (error) =>
				new InfraError({
					type: "database",
					message: error instanceof Error ? error.message : "Unknown error",
				}),
		});

		yield* Effect.tryPromise({
			try: () =>
				database
					.insertInto("listing_transaction_log")
					.values({
						id: genId(),
						listingTransactionId: transaction.id,
						status,
						side,
						createdAt: nowDate,
					})
					.execute(),
			catch: (error) =>
				new InfraError({
					type: "database",
					message: error instanceof Error ? error.message : "Unknown error",
				}),
		});

		return transaction;
	});
};

export type createListingTransactionFx = ReturnType<typeof createListingTransactionFx>;
