import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionCollectionFx } from "~/@user/transaction/fx/transactionCollectionFx";
import { transactionStatusCloseFx } from "~/@user/transaction-status/fx/transactionStatusCloseFx";
import { transactionStatusFetchFx } from "~/@user/transaction-status/fx/transactionStatusFetchFx";
import { transactionStatusSuccessFx } from "~/@user/transaction-status/fx/transactionStatusSuccessFx";

export namespace t04_buyerFinish {
	export interface Props {
		fromMinutes: number;
		toMinutes: number;
	}
}

export const t04_buyerFinish = Effect.fn("t04_buyerFinish")(function* ({
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
			] as const),
		)
			.with("success", () => {
				return transactionStatusSuccessFx({
					transactionId: transactionId.id,
					createdAt: DateTime.fromJSDate(transactionStatus.createdAt).plus({
						minute: rangedom(fromMinutes, toMinutes),
					}),
				});
			})
			.with("close", () => {
				return transactionStatusCloseFx({
					transactionId: transactionId.id,
					createdAt: DateTime.fromJSDate(transactionStatus.createdAt).plus({
						minute: rangedom(fromMinutes, toMinutes),
					}),
				});
			})
			.exhaustive();
	}
});
