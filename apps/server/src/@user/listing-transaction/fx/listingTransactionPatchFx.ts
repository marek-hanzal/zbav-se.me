import { Effect } from "effect";
import { DateTime } from "luxon";
import { AccessDeniedError } from "~/error/AccessDeniedError";
import type { ListingTransactionSideSchema } from "../../../app/listing-transaction/schema/ListingTransactionSideSchema";
import type { ListingTransactionStatusSchema } from "../../../app/listing-transaction/schema/ListingTransactionStatusSchema";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withTransactionFx } from "../../../database/fx/withTransactionFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { listingTransactionStatusCreateFx } from "../../listing-transaction-status/fx/listingTransactionStatusCreateFx";
import { ListingTransactionContextFx } from "./ListingTransactionContextFx";
import { listingTransactionFetchFx } from "./listingTransactionFetchFx";

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
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;
			const config = yield* ListingTransactionContextFx;

			const transaction = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("listing_transaction as lt")
					.innerJoin("listing as l", "l.id", "lt.listingId")
					.select([
						"lt.userId",
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
				return yield* new AccessDeniedError({
					message: "You are not allowed to modify this transaction",
				});
			}

			const nextStatus = status ?? transaction.status;
			const nextSide = side ?? transaction.side;
			const now = DateTime.now();

			yield* Effect.tryPromise(async () => {
				return database
					.updateTable("listing_transaction")
					.set(() => ({
						status: nextStatus,
						side: nextSide,
						updatedAt: now.toJSDate(),
						expiresAt: now
							.plus({
								days: config.extend,
							})
							.toJSDate(),
					}))
					.where("id", "=", transactionId)
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* listingTransactionStatusCreateFx({
				listingTransactionId: transactionId,
				status: nextStatus,
				side: nextSide,
				createdAt: now.toJSDate(),
			});

			return yield* listingTransactionFetchFx({
				query: {
					where: {
						id: transactionId,
					},
				},
			});
		}),
	);
};

export type listingTransactionPatchFx = ReturnType<typeof listingTransactionPatchFx>;
