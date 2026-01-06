import { NotFoundErrorFx } from "@use-pico/common/error";
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
	const database = yield* DatabaseContextFx;

	const { data: transactions } = yield* transactionCollectionFx({
		cursor: {
			page: 0,
			size: 1000,
		},
	});

	for (const transactionId of transactions) {
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

		const transaction = yield* transactionFetchFx({
			where: {
				id: transactionId.id,
			},
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
					transactionId: transactionId.id,
					createdAt: DateTime.fromJSDate(transaction.createdAt).plus({
						minute: rangedom(fromMinutes, toMinutes),
					}),
				}).pipe(UserContextProvider(current));
			})
			.with("reject-seller", () => {
				return transactionStatusRejectFx({
					transactionId: transactionId.id,
					createdAt: DateTime.fromJSDate(transaction.createdAt).plus({
						minute: rangedom(fromMinutes, toMinutes),
					}),
				}).pipe(UserContextProvider(current));
			})
			.with("reject-buyer", () => {
				return transactionStatusRejectFx({
					transactionId: transactionId.id,
					createdAt: DateTime.fromJSDate(transaction.createdAt).plus({
						minute: rangedom(fromMinutes, toMinutes),
					}),
				}).pipe(UserContextProvider(current));
			})
			.exhaustive();
	}
});
