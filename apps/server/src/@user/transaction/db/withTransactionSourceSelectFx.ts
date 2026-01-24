import { Effect } from "effect";
import { match } from "ts-pattern";
import type { TransactionSortSchema } from "~/@user/transaction/schema/TransactionSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withTransactionSourceSelectFx {
	export interface Props {
		sort?: TransactionSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withTransactionSourceSelectFx>>;
}

export const withTransactionSourceSelectFx = Effect.fn("withTransactionSourceSelectFx")(function* ({
	sort,
}: withTransactionSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id")
		.innerJoin("location as loc", "l.locationId", "loc.id")
		.leftJoinLateral(
			(eb) =>
				eb
					.selectFrom("transaction_status as lts2")
					.select([
						"lts2.status as latestStatus",
						"lts2.createdAt as latestStatusCreatedAt",
					])
					.whereRef("lts2.transactionId", "=", eb.ref("lt.id"))
					.orderBy("lts2.createdAt", "desc")
					.limit(1)
					.as("status"),
			(join) => join.onTrue(),
		);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.direction))
			.with("status", () =>
				query.orderBy(
					(eb) =>
						eb
							.case(eb.ref("status.latestStatus"))
							.when("pending")
							.then(10)
							.when("dispute")
							.then(15)
							.when("open")
							.then(20)
							.when("resolved")
							.then(30)
							.when("rejected")
							.then(40)
							.when("expired")
							.then(50)
							.when("success")
							.then(60)
							.when("closed")
							.then(70)
							.else(999)
							.end(),
					item.direction,
				),
			)
			.exhaustive();
	}

	return query;
});
