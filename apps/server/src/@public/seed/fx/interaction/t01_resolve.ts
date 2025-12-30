import { list, rangedom } from "@use-pico/common/rangedom";
import { Effect } from "effect";
import { DateTime } from "luxon";
import { match } from "ts-pattern";
import { transactionCollectionFx } from "~/@user/transaction/fx/transactionCollectionFx";
import { transactionStatusFetchFx } from "~/@user/transaction-status/fx/transactionStatusFetchFx";
import { transactionStatusResolveFx } from "~/@user/transaction-status/fx/transactionStatusResolveFx";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace t01_resolve {
	export interface Props {
		fromMinutes: number;
		toMinutes: number;
	}
}

export const t01_resolve = ({ fromMinutes, toMinutes }: t01_resolve.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const transactions = yield* transactionCollectionFx({
			cursor: {
				page: 0,
				size: 1000,
			},
			where: {
				status: "open",
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
					return Effect.gen(function* () {
						yield* transactionStatusResolveFx({
							transactionId: transactionId.id,
							createdAt: DateTime.fromJSDate(transactionStatus.createdAt).plus({
								minute: rangedom(fromMinutes, toMinutes),
							}),
						}).pipe(UserContextProvider(current));
					});
				})
				.with("noop", () => {
					return Effect.void;
				})
				.exhaustive();
		}
	});
};
