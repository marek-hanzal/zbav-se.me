import { NotFoundErrorFx } from "@use-pico/common/error";
import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionCollectionFx } from "~/app/transaction/fx/transactionCollectionFx";
import { transactionStatusDisputeFx } from "~/app/transaction-status/fx/transactionStatusDisputeFx";
import { transactionStatusFetchFx } from "~/app/transaction-status/fx/transactionStatusFetchFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace t03_sellerReaction {
	export interface Props {
		fromMinutes: number;
		toMinutes: number;
	}
}

export const t03_sellerReaction = Effect.fn("t03_sellerReaction")(function* ({
	fromMinutes,
	toMinutes,
}: t03_sellerReaction.Props) {
	const kysely = yield* KyselyContextFx;

	const transactions = yield* transactionCollectionFx({
		cursor: {
			page: 0,
			size: 1000,
		},
		where: {
			status: "resolved",
		},
		scope: {},
	});

	for (const transactionId of transactions.data) {
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
				"dispute",
				"noop",
			] as const),
		)
			.with("dispute", () => {
				return transactionStatusDisputeFx({
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
