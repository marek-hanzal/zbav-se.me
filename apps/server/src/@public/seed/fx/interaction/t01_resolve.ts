import { NotFoundErrorFx } from "@use-pico/common/error";
import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionStatusFetchFx } from "~/@user/transaction-status/fx/transactionStatusFetchFx";
import { transactionStatusResolveFx } from "~/@user/transaction-status/fx/transactionStatusResolveFx";
import { transactionCollectionFx } from "~/app/transaction/fx/transactionCollectionFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace t01_resolve {
	export interface Props {
		fromMinutes: number;
		toMinutes: number;
	}
}

export const t01_resolve = Effect.fn("t01_resolve")(function* ({
	fromMinutes,
	toMinutes,
}: t01_resolve.Props) {
	const database = yield* DatabaseContextFx;

	const transactions = yield* transactionCollectionFx({
		cursor: {
			page: 0,
			size: 1000,
		},
		where: {
			status: "open",
		},
		scope: {},
	});

	for (const transactionId of transactions.data) {
		const current = yield* Effect.promise(async () => {
			return database
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
				"resolve",
				"noop",
			] as const),
		)
			.with("resolve", () => {
				return transactionStatusResolveFx({
					userId: current.id,
					transactionId: transactionId.id,
					createdAt: DateTime.fromJSDate(transactionStatus.createdAt).plus({
						minute: rangedom(fromMinutes, toMinutes),
					}),
				});
			})
			.with("noop", () => {
				return Effect.void;
			})
			.exhaustive();
	}
});
