import { NotFoundErrorFx } from "@use-pico/common/error";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { messageThreadCreateFx } from "~/@user/message-thread/fx/messageThreadCreateFx";
import { messageUserCreateFx } from "~/@user/message-thread-user/fx/messageUserCreateFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { TransactionContextFx } from "./TransactionContextFx";
import { transactionFetchFx } from "./transactionFetchFx";

export namespace transactionCreateFx {
	export interface Props {
		listingId: string;
		createdAt?: DateTime;
	}
}

export const transactionCreateFx = Effect.fn("transactionCreateFx")(function* ({
	listingId,
	createdAt,
}: transactionCreateFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;
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
					user.id,
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
						id,
						userId: user.id,
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
				transactionId: id,
				listingId,
				side: "buyer",
				status: "pending",
				createdAt,
			});

			yield* listingEventCreateFx({
				listingId,
				event: "transaction",
				createdAt,
			}).pipe(Effect.ignore);

			yield* messageSystemCreateFx({
				messageThreadId: messageThread.id,
				message: "Transaction pending (message)",
				createdAt,
			});

			yield* userInteractionEventFx({
				userId: user.id,
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
			});
		}),
	);
});

export type transactionCreateFx = ReturnType<typeof transactionCreateFx>;
