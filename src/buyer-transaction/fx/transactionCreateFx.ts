import { Effect } from "effect";
import { listingFetchFx } from "~/buyer-listing/fx/listingFetchFx";
import { listingEventCreateFx } from "~/buyer-listing-event/fx/listingEventCreateFx";
import { transactionFetchFx } from "~/buyer-transaction/fx/transactionFetchFx";
import type { TransactionCreateSchema } from "~/buyer-transaction/schema/TransactionCreateSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { DateServiceFx } from "~/date/service/DateServiceFx";
import { genId } from "~/identity/fn/genId";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { activityCreateFx } from "~/user-activity/fx/activityCreateFx";
import { userInteractionEventFx } from "~/user-event/fx/userInteractionEventFx";
import { TransactionContextFx } from "~/user-transaction/context/TransactionContextFx";
import { transactionStatusMessageFx } from "~/user-transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/user-transaction/fx/transactionUpdateStatusFx";
import { transactionUserCreateFx } from "~/user-transaction-user/fx/transactionUserCreateFx";

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
			const dateService = yield* DateServiceFx;

			const listing = yield* listingFetchFx({
				userId,
				where: {
					id: listingId,
				},
				scope: {},
			});

			const now = dateService.now();

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
