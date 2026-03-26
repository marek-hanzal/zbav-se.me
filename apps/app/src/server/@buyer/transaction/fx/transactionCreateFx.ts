import { DateContextFx } from "@use-pico/common/date";
import { NotFoundErrorFx } from "@use-pico/common/error";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/server/@buyer/listing-event/fx/listingEventCreateFx";
import { transactionFetchFx } from "~/server/@buyer/transaction/fx/transactionFetchFx";
import type { TransactionCreateSchema } from "~/server/@buyer/transaction/schema/TransactionCreateSchema";
import { inboxCreateFx } from "~/server/@user/inbox/fx/inboxCreateFx";
import { TransactionContextFx } from "~/server/@user/transaction/context/TransactionContextFx";
import { transactionStatusMessageFx } from "~/server/@user/transaction/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/server/@user/transaction/fx/transactionUpdateStatusFx";
import { transactionUserCreateFx } from "~/server/@user/transaction-user/fx/transactionUserCreateFx";
import { userInteractionEventFx } from "~/server/@user/user-event/fx/userInteractionEventFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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

			const listing = yield* tryDbFx(async () =>
				kysely
					.selectFrom("listing")
					.select([
						"id",
						"userId",
					])
					.where("id", "=", listingId)
					.executeTakeFirst(),
			);

			if (!listing) {
				return yield* new NotFoundErrorFx({
					resource: "listing",
					resourceId: listingId,
					message: "Listing not found",
				});
			}

			const now = dateContext.now();

			const id = genId();

			yield* tryDbFx(async () =>
				kysely
					.insertInto("transaction")
					.values({
						...data,
						id,
						userId,
						listingId,
						createdAt: now.toJSDate(),
						updatedAt: now.toJSDate(),
						status: "pending",
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
				request: "pending",
				target: "buyer",
			});

			yield* transactionStatusMessageFx({
				transactionId: id,
				request: "pending",
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
			}).pipe(Effect.ignore);

			yield* inboxCreateFx({
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
