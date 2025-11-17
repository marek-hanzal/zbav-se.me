import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { WithDatabase } from "../../../database/WithDatabase";
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
		const listing = yield* Effect.promise(async () => {
			return database
				.selectFrom("listing")
				.select([
					"id",
					"userId",
				])
				.where("id", "=", listingId)
				.executeTakeFirst();
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

		const now = DateTime.now();
		const expiresAt = now.plus({
			days: 3,
		});
		const nowDate = now.toJSDate();
		const expiresAtDate = expiresAt.toJSDate();

		const transaction = yield* Effect.promise(async () => {
			return database
				.insertInto("listing_transaction")
				.values({
					id: genId(),
					userId,
					listingId,
					side: "buyer",
					status: "request",
					createdAt: nowDate,
					updatedAt: nowDate,
					expiresAt: expiresAtDate,
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		yield* Effect.promise(async () => {
			return database
				.insertInto("listing_transaction_log")
				.values({
					id: genId(),
					listingTransactionId: transaction.id,
					side: "buyer",
					status: "request",
					createdAt: nowDate,
				})
				.returningAll()
				.executeTakeFirstOrThrow();
		});

		return transaction;
	});
};

export type createListingTransactionFx = ReturnType<typeof createListingTransactionFx>;
