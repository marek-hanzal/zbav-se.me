import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { getLoggerFx } from "@/lib/common/log";
import { listingFetchFx } from "~/buyer/listing/server/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer/listing-event/server/fx/listingEventCreateFx";
import { transactionFetchFx } from "~/buyer/transaction/server/fx/transactionFetchFx";
import type { TransactionCreateSchema } from "~/buyer/transaction/server/schema/TransactionCreateSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { activityCreateFx } from "~/user/activity/server/fx/activityCreateFx";
import { TransactionContextFx } from "~/user/transaction/server/context/TransactionContextFx";
import { transactionStatusMessageFx } from "~/user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user/transaction/server/fx/transactionUpdateStatusFx";
import { transactionUserCreateFx } from "~/user/transaction-user/server/fx/transactionUserCreateFx";
import { userInteractionEventFx } from "~/user/user-event/server/fx/userInteractionEventFx";

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
	const logger = yield* getLoggerFx("transactionCreateFx", "transaction");
	logger.trace("transactionCreateFx", {
		userId,
		listingId,
		...data,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const config = yield* TransactionContextFx;
			const dateContext = yield* DateContextFx;

			const listing = yield* listingFetchFx({
				userId,
				where: {
					id: listingId,
				},
				scope: {},
			});

			const now = dateContext.now();

			const id = genId();

			yield* dbFx(async () =>
				kysely
					.insertInto("transaction")
					.values({
						...data,
						id,
						userId,
						listingId,
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
						status: "interest",
						statusUpdatedAt: now.toJSDate(),
						expiresAt: now
							.plus({
								days: config.expires,
							})
							.toJSDate(),
					})
					.returningAll()
					.executeTakeFirstOrThrow(),
			);

			yield* transactionUpdateStatusFx({
				transactionId: id,
				status: null,
				request: "interest",
				target: "buyer",
			});

			yield* transactionStatusMessageFx({
				transactionId: id,
				request: "interest",
				target: "buyer",
				userId,
			});

			yield* transactionUserCreateFx({
				transactionId: id,
				users: [
					{
						userId,
						side: "buyer",
					},
					{
						userId: listing.userId,
						side: "seller",
					},
				],
			});

			yield* listingEventCreateFx({
				userId,
				listingId,
				event: "transaction",
				checkVisibility: false,
			}).pipe(Effect.ignore);

			yield* activityCreateFx({
				userId: listing.userId,
				reference: [
					listingId,
					id,
				],
				family: "transaction",
				type: "buyer-message",
				payload: {
					transactionId: id,
				},
				priority: "high",
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
