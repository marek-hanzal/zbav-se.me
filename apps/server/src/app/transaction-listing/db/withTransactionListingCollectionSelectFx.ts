import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { TransactionListingSortSchema } from "../schema/TransactionListingSortSchema";

export namespace withTransactionListingCollectionSelectFx {
	export interface Props {
		sort?: TransactionListingSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingCollectionSelectFx>
	>;
}

export const withTransactionListingCollectionSelectFx = Effect.fn(
	"withTransactionListingCollectionSelectFx",
)(function* ({ sort }: withTransactionListingCollectionSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id")
		.select((eb) => [
			eb.ref("l.id").as("listingId"),
			sql<number>`count(${eb.ref("lt.id")})`.as("count"),
			sql<Date>`max(${eb.ref("lt.updatedAt")})`.as("lastAt"),
		])
		.groupBy("l.id");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("l.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
