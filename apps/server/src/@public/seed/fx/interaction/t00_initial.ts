import { DateContextLayer } from "@use-pico/common/date";
import { NotFoundErrorFx } from "@use-pico/common/error";
import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionCollectionFx } from "~/@buyer-user/transaction/fx/transactionCollectionFx";
import { transactionFetchFx } from "~/@buyer-user/transaction/fx/transactionFetchFx";
import { transactionStatusRejectFx as buyerTransactionStatusRejectFx } from "~/@buyer-user/transaction-status/fx/transactionStatusRejectFx";
import { transactionStatusAcceptFx } from "~/@seller-user/transaction-status/fx/transactionStatusAcceptFx";
import { transactionStatusRejectFx as sellerTransactionStatusRejectFx } from "~/@seller-user/transaction-status/fx/transactionStatusRejectFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace t00_initial {
	export interface Props {
		fromMinutes: number;
		toMinutes: number;
	}
}

export const t00_initial = Effect.fn("t00_initial")(function* ({
	fromMinutes,
	toMinutes,
}: t00_initial.Props) {
	const { kysely } = yield* KyselyContextFx;

	const { data: transactions } = yield* transactionCollectionFx({
		cursor: {
			page: 0,
			size: 1000,
		},
		scope: {},
	});

	for (const transactionId of transactions) {
		const current = yield* Effect.promise(async () => {
			return kysely
				.selectFrom("user as user")
				.innerJoin("listing as l", "l.userId", "user.id")
				.innerJoin("transaction as t", "t.listingId", "l.id")
				.where("t.id", "=", transactionId.id)
				.selectAll("user")
				.executeTakeFirst();
		});

		if (!current) {
			return yield* new NotFoundErrorFx({
				resource: "user",
				resourceId: transactionId.id,
				message: "User not found",
			});
		}

		const transaction = yield* transactionFetchFx({
			where: {
				id: transactionId.id,
			},
			scope: {},
		});

		yield* match(
			list([
				"accept",
				"accept",
				"accept",
				"reject-seller",
				"reject-buyer",
			] as const),
		)
			.with("accept", () => {
				return transactionStatusAcceptFx({
					userId: current.id,
					transactionId: transactionId.id,
				}).pipe(
					Effect.provide(
						DateContextLayer({
							now() {
								return DateTime.fromJSDate(transaction.createdAt).plus({
									minute: rangedom(fromMinutes, toMinutes),
								});
							},
						}),
					),
				);
			})
			.with("reject-seller", () => {
				return sellerTransactionStatusRejectFx({
					userId: current.id,
					transactionId: transactionId.id,
				}).pipe(
					Effect.provide(
						DateContextLayer({
							now() {
								return DateTime.fromJSDate(transaction.createdAt).plus({
									minute: rangedom(fromMinutes, toMinutes),
								});
							},
						}),
					),
				);
			})
			.with("reject-buyer", () => {
				return buyerTransactionStatusRejectFx({
					userId: transaction.userId,
					transactionId: transactionId.id,
				}).pipe(
					Effect.provide(
						DateContextLayer({
							now() {
								return DateTime.fromJSDate(transaction.createdAt).plus({
									minute: rangedom(fromMinutes, toMinutes),
								});
							},
						}),
					),
				);
			})
			.exhaustive();
	}
});
