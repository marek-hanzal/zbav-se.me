import { NotFoundErrorFx } from "@use-pico/common/error";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { listingEventCreateFx } from "~/app/listing-event/fx/listingEventCreateFx";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import { messageThreadCreateFx } from "~/app/message-thread/fx/messageThreadCreateFx";
import { messageUserCreateFx } from "~/app/message-thread-user/fx/messageUserCreateFx";
import { TransactionContextFx } from "~/app/transaction/context/TransactionContextFx";
import { transactionFetchFx } from "~/app/transaction/fx/transactionFetchFx";
import type { TransactionCreateSchema } from "~/app/transaction/schema/TransactionCreateSchema";
import { transactionStatusCreateFx } from "~/app/transaction-status/fx/transactionStatusCreateFx";
import { userInteractionEventFx } from "~/app/user-event/fx/userInteractionEventFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionCreateFx {
	export interface Props extends TransactionCreateSchema.Type {
		userId: string;
		createdAt?: DateTime;
	}
}

export const transactionCreateFx = Effect.fn("transactionCreateFx")(function* ({
	userId,
	createdAt,
	listingId,
	...data
}: transactionCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const config = yield* TransactionContextFx;

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
				return yield* new NotFoundErrorFx({
					resource: "listing",
					resourceId: listingId,
					message: "Listing not found",
				});
			}

			const messageThread = yield* messageThreadCreateFx({});

			yield* messageUserCreateFx({
				messageThreadId: messageThread.id,
				userIds: [
					/**
					 * Allow current user executing transaction request
					 */
					userId,
					/**
					 * Allow seller to participate in this thread too.
					 */
					listing.userId,
				],
				createdAt,
			});

			const id = genId();

			yield* Effect.promise(async () => {
				return database
					.insertInto("transaction")
					.values({
						...data,
						id,
						userId,
						listingId,
						messageThreadId: messageThread.id,
						createdAt: (createdAt ?? DateTime.now()).toJSDate(),
						updatedAt: (createdAt ?? DateTime.now()).toJSDate(),
						expiresAt: (createdAt ?? DateTime.now())
							.plus({
								days: config.expires,
							})
							.toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			});

			yield* transactionStatusCreateFx({
				userId,
				transactionId: id,
				listingId,
				side: "buyer",
				status: "pending",
				createdAt,
			});

			yield* listingEventCreateFx({
				userId,
				listingId,
				event: "transaction",
				createdAt,
			}).pipe(Effect.ignore);

			yield* messageSystemCreateFx({
				userId,
				messageThreadId: messageThread.id,
				message: "Transaction pending (message)",
				createdAt,
			});

			yield* userInteractionEventFx({
				userId,
				targetId: listing.userId,
				source: "transaction",
				group: id,
				event: "transaction.create",
				isTerminal: false,
			});

			return yield* transactionFetchFx({
				where: {
					id,
				},
				scope: {
					userId,
				},
			});
		}),
	);
});

export type transactionCreateFx = ReturnType<typeof transactionCreateFx>;
