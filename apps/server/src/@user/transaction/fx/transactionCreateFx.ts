import { NotFoundErrorFx } from "@use-pico/common/error";
import { genId } from "@use-pico/common/gen-id";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { DateTime } from "luxon";
import type { TransactionCreateSchema } from "~/@user/transaction/schema/TransactionCreateSchema";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import { userInteractionEventFx } from "~/@user/user-event/fx/userInteractionEventFx";
import { listingEventCreateFx } from "~/app/listing-event/fx/listingEventCreateFx";
import { messageSystemCreateFx } from "~/app/message-system/fx/messageSystemCreateFx";
import { messageThreadCreateFx } from "~/app/message-thread/fx/messageThreadCreateFx";
import { messageUserCreateFx } from "~/app/message-thread-user/fx/messageUserCreateFx";
import type { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { TransactionContextFx } from "./TransactionContextFx";
import { transactionFetchFx } from "./transactionFetchFx";

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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<transactionCreateFx>, UserContextFx>>;
