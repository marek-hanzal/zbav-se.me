import { z } from "@hono/zod-openapi";
import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionCollectionFx } from "~/@user/transaction/fx/transactionCollectionFx";
import { transactionFetchFx } from "~/@user/transaction/fx/transactionFetchFx";
import { transactionStatusAcceptFx } from "~/@user/transaction-status/fx/transactionStatusAcceptFx";
import { transactionStatusRejectFx } from "~/@user/transaction-status/fx/transactionStatusRejectFx";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export const SeedTransactionInteractionRequestSchema = z.object({
	//
});

export namespace SeedTransactionInteractionRequestSchema {
	export type Props = z.infer<typeof SeedTransactionInteractionRequestSchema>;
}

export const seedTransactionInteractionFx = (_: SeedTransactionInteractionRequestSchema.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const transactions = yield* transactionCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
		});

		for (const transactionId of transactions.data) {
			const current = yield* Effect.tryPromise(async () => {
				return database
					.selectFrom("user as user")
					.innerJoin("listing as l", "l.userId", "user.id")
					.innerJoin("transaction as t", "t.listingId", "l.id")
					.where("t.id", "=", transactionId.id)
					.selectAll("user")
					.executeTakeFirst();
			});

			if (!current) {
				return yield* new NotFoundError({
					resource: "user",
					resourceId: transactionId.id,
					message: "User not found",
				});
			}

			const transaction = yield* transactionFetchFx({
				where: {
					id: transactionId.id,
				},
			});

			yield* match(
				list([
					"accept",
					"reject-seller",
					"reject-buyer",
				] as const),
			)
				.with("accept", () => {
					return Effect.gen(function* () {
						yield* transactionStatusAcceptFx({
							transactionId: transactionId.id,
							createdAt: DateTime.fromJSDate(transaction.createdAt).plus({
								minute: rangedom(10, 60 * 24 * 2),
							}),
						}).pipe(UserContextProvider(current));
					});
				})
				.with("reject-seller", () => {
					return Effect.gen(function* () {
						yield* transactionStatusRejectFx({
							transactionId: transactionId.id,
							createdAt: DateTime.fromJSDate(transaction.createdAt).plus({
								minute: rangedom(10, 60 * 24 * 2),
							}),
						}).pipe(UserContextProvider(current));
					});
				})
				.with("reject-buyer", () => {
					return Effect.gen(function* () {
						yield* transactionStatusRejectFx({
							transactionId: transactionId.id,
							createdAt: DateTime.fromJSDate(transaction.createdAt).plus({
								minute: rangedom(10, 60 * 24 * 2),
							}),
						});
					});
				})
				.exhaustive();
		}
	});
};
