import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { listingTransactionLogCreateFx } from "../../listing-transaction-log/fx/listingTransactionLogCreateFx";

export namespace listingTransactionCreateFx {
	export interface Props {
		listingId: string;
	}
}

export const listingTransactionCreateFx = ({ listingId }: listingTransactionCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

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
			return yield* new NotFoundError({
				resource: "listing",
				resourceId: listingId,
				message: "Listing not found",
			});
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
					userId: user.id,
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

		yield* listingTransactionLogCreateFx({
			listingTransactionId: transaction.id,
			side: "buyer",
			status: "request",
			createdAt: nowDate,
		});

		return transaction;
	});
};

export type listingTransactionCreateFx = ReturnType<typeof listingTransactionCreateFx>;
