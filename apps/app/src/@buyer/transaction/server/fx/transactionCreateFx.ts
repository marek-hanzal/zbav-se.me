import { DateContextFx } from "@use-pico/common/date";
import { NotFoundErrorFx } from "@use-pico/common/error";
import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { listingEventCreateFx } from "~/@buyer/listing-event/server/fx/listingEventCreateFx";
import { transactionFetchFx } from "~/@buyer/transaction/server/fx/transactionFetchFx";
import type { TransactionCreateSchema } from "~/@buyer/transaction/server/schema/TransactionCreateSchema";
import { inboxCreateFx } from "~/@user/inbox/server/fx/inboxCreateFx";
import { TransactionContextFx } from "~/@user/transaction/server/context/TransactionContextFx";
import { transactionStatusMessageFx } from "~/@user/transaction/server/fx/transactionStatusMessageFx";
import { transactionUpdateStatusFx } from "~/@user/transaction/server/fx/transactionUpdateStatusFx";
import { transactionUserCreateFx } from "~/@user/transaction-user/server/fx/transactionUserCreateFx";
import { userInteractionEventFx } from "~/@user/user-event/server/fx/userInteractionEventFx";
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
