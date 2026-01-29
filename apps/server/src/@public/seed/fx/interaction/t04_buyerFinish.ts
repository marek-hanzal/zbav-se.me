import { DateContextLayer } from "@use-pico/common/date";
import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionCollectionFx } from "~/@buyer-user/transaction/fx/transactionCollectionFx";
import { transactionStatusCloseFx } from "~/@buyer-user/transaction-status/fx/transactionStatusCloseFx";
import { transactionStatusSuccessFx } from "~/@buyer-user/transaction-status/fx/transactionStatusSuccessFx";
import { transactionStatusFetchFx } from "~/@session/transaction-status/fx/transactionStatusFetchFx";

export namespace t04_buyerFinish {
	export interface Props {
		userId: string;
		fromMinutes: number;
		toMinutes: number;
	}
}

export const t04_buyerFinish = Effect.fn("t04_buyerFinish")(function* ({
	userId,
	fromMinutes,
	toMinutes,
}: t04_buyerFinish.Props) {
	const transactions = yield* transactionCollectionFx({
		cursor: {
			page: 0,
			size: 1000,
		},
		where: {
			statusIn: [
				"resolved",
				"open",
				"dispute",
			],
		},
		scope: {},
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
			scope: {},
		});

		yield* match(
			list([
				"success",
				"close",
			] as const),
		)
			.with("success", () => {
				return transactionStatusSuccessFx({
					userId,
					transactionId: transactionId.id,
				}).pipe(
					Effect.provide(
						DateContextLayer({
							now() {
								return DateTime.fromJSDate(transactionStatus.createdAt).plus({
									minute: rangedom(fromMinutes, toMinutes),
								});
							},
						}),
					),
				);
			})
			.with("close", () => {
				return transactionStatusCloseFx({
					userId,
					transactionId: transactionId.id,
				}).pipe(
					Effect.provide(
						DateContextLayer({
							now() {
								return DateTime.fromJSDate(transactionStatus.createdAt).plus({
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
