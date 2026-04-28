import { Effect } from "effect";
import { match } from "ts-pattern";
import type { TransactionSortSchema } from "~/seller/transaction/server/schema/TransactionSortSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

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
		.innerJoin("listing as l", "lt.listingId", "l.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.order))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.order))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.order))
			.with("lastAt", () => {
				return query.orderBy((eb) => {
					return eb.fn.coalesce(
						/**
						 * Sort seller transaction rows by the latest seller-visible activity.
						 *
						 * Buyer text in `interest` is intentionally hidden until `trade`; using it
						 * for `lastAt` would silently bubble an unopened trade to the top and expose
						 * that the buyer wrote something. Non-text entries, especially
						 * `status-interest`, are still valid seller-visible activity.
						 */
						eb
							.selectFrom("transaction_entry as te")
							.select("te.createdAt")
							.whereRef("te.transactionId", "=", "lt.id")
							.where((eb) => {
								return eb.or([
									eb("te.kind", "!=", "text"),
									eb("lt.status", "!=", "interest"),
								]);
							})
							.orderBy("te.createdAt", "desc")
							.limit(1)
							.$asScalar(),
						eb.ref("lt.updatedAt"),
					);
				}, item.order);
			})
			.with("status", () => {
				return query.orderBy((eb) => {
					return eb
						.case(eb.ref("lt.status"))
						.when("interest")
						.then(10)
						.when("trade")
						.then(20)
						.when("resolved")
						.then(30)
						.when("dispute")
						.then(40)
						.when("rejected")
						.then(50)
						.when("sold")
						.then(60)
						.when("expired")
						.then(70)
						.when("success")
						.then(80)
						.when("closed")
						.then(90)
						.else(999)
						.end();
				}, item.order);
			})
			.exhaustive();
	}

	return query;
});
