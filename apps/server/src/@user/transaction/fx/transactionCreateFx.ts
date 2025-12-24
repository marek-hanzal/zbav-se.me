import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { listingEventCreateFx } from "~/@user/listing-event/fx/listingEventCreateFx";
import { messageSystemCreateFx } from "~/@user/message-system/fx/messageSystemCreateFx";
import { messageThreadCreateFx } from "~/@user/message-thread/fx/messageThreadCreateFx";
import { messageUserCreateFx } from "~/@user/message-thread-user/fx/messageUserCreateFx";
import { transactionStatusCreateFx } from "~/@user/transaction-status/fx/transactionStatusCreateFx";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { NotFoundError } from "~/error/NotFoundError";
import { TransactionContextFx } from "./TransactionContextFx";
import { transactionFetchFx } from "./transactionFetchFx";

export namespace transactionCreateFx {
	export interface Props {
		listingId: string;
	}
}

export const transactionCreateFx = ({ listingId }: transactionCreateFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;
			const user = yield* UserContextFx;
			const config = yield* TransactionContextFx;

			const listing = yield* Effect.tryPromise(async () => {
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
			});

			const id = genId();

			yield* Effect.tryPromise(async () => {
				return database
					.insertInto("transaction")
					.values({
						id,
						userId: user.id,
						listingId,
						messageThreadId: messageThread.id,
						createdAt: DateTime.now().toJSDate(),
						updatedAt: DateTime.now().toJSDate(),
						expiresAt: DateTime.now()
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
				side: "buyer",
				status: "pending",
			});

			yield* listingEventCreateFx({
				listingId,
				event: "transaction",
			}).pipe(Effect.ignore);

			yield* messageSystemCreateFx({
				messageThreadId: messageThread.id,
				message: "Buyer: Transaction request created (message)",
			});

			return yield* transactionFetchFx({
				where: {
					id,
				},
			});
		}),
	);
};

export type transactionCreateFx = ReturnType<typeof transactionCreateFx>;
