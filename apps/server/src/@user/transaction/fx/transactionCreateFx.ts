import { DateContextFx } from "@use-pico/common/date";
import { NotFoundErrorFx } from "@use-pico/common/error";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/@session/listing-event/fx/listingEventCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { messageThreadCreateFx } from "~/@user/message-thread/fx/messageThreadCreateFx";
import { messageUserCreateFx } from "~/@user/message-thread-user/fx/messageUserCreateFx";
import { TransactionContextFx } from "~/@user/transaction/context/TransactionContextFx";
import { transactionFetchFx } from "~/@user/transaction/fx/transactionFetchFx";
import type { TransactionCreateSchema } from "~/@user/transaction/schema/TransactionCreateSchema";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { transactionStatusCreateFx } from "~/app/transaction-status/fx/transactionStatusCreateFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace transactionCreateFx {
	export interface Props extends TransactionCreateSchema.Type {
		userId: string;
	}
}

export const transactionCreateFx = Effect.fn("transactionCreateFx")(function* ({
	userId,
	listingId,
	...data
}: transactionCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const config = yield* TransactionContextFx;
			const dateContext = yield* DateContextFx;

			const listing = yield* Effect.promise(async () => {
				return kysely
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
			const now = dateContext.now();

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
			});

			const id = genId();

			yield* Effect.promise(async () => {
				return kysely
					.insertInto("transaction")
					.values({
						...data,
						id,
						userId,
						listingId,
						messageThreadId: messageThread.id,
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
						expiresAt: now
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
			});

			yield* listingEventCreateFx({
				userId,
				listingId,
				event: "transaction",
			}).pipe(Effect.ignore);

			yield* messageSystemCreateFx({
				userId,
				messageThreadId: messageThread.id,
				text: "Transaction pending (message)",
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
