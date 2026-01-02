import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionCollectionFx } from "~/@user/transaction/fx/transactionCollectionFx";
import { transactionStatusCloseFx } from "~/@user/transaction-status/fx/transactionStatusCloseFx";
import { transactionStatusDisputeFx } from "~/@user/transaction-status/fx/transactionStatusDisputeFx";
import { transactionStatusFetchFx } from "~/@user/transaction-status/fx/transactionStatusFetchFx";
import { transactionStatusSuccessFx } from "~/@user/transaction-status/fx/transactionStatusSuccessFx";

export namespace t02_buyerReaction {
	export interface Props {
		fromMinutes: number;
		toMinutes: number;
	}
}

export const t02_buyerReaction = ({ fromMinutes, toMinutes }: t02_buyerReaction.Props) => {
	return Effect.gen(function* () {
		const transactions = yield* transactionCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
			where: {
				status: "resolved",
			},
		});

		for (const transactionId of transactions.data) {
			const transactionStatus = yield* transactionStatusFetchFx({
				where: {
					transactionId: transactionId.id,
				},
				sort: [
					{
						field: "createdAt",
						direction: "desc",
					},
				],
			});

			yield* match(
				list([
					"success",
					"close",
					"dispute",
				] as const),
			)
				.with("success", () => {
					return Effect.gen(function* () {
						yield* transactionStatusSuccessFx({
							transactionId: transactionId.id,
							createdAt: DateTime.fromJSDate(transactionStatus.createdAt).plus({
								minute: rangedom(fromMinutes, toMinutes),
							}),
						});
					});
				})
				.with("close", () => {
					return Effect.gen(function* () {
						yield* transactionStatusCloseFx({
							transactionId: transactionId.id,
							createdAt: DateTime.fromJSDate(transactionStatus.createdAt).plus({
								minute: rangedom(fromMinutes, toMinutes),
							}),
						});
					});
				})
				.with("dispute", () => {
					return Effect.gen(function* () {
						yield* transactionStatusDisputeFx({
							transactionId: transactionId.id,
							createdAt: DateTime.fromJSDate(transactionStatus.createdAt).plus({
								minute: rangedom(fromMinutes, toMinutes),
							}),
						});
					});
				})
				.exhaustive();
		}
	});
};
