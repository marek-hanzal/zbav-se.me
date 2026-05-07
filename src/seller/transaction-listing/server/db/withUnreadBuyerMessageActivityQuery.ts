import type { ExpressionBuilder, RawBuilder } from "kysely";
import { sql } from "kysely";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import type { ListingTableSchema } from "~/server/database/@table/ListingTableSchema";

export namespace withUnreadBuyerMessageActivityQuery {
	export interface Database {
		i: ActivityTableSchema.Type;
		l: ListingTableSchema.Type;
	}

	export interface Query<TSelf> {
		whereRef(lhs: "i.userId", op: "=", rhs: "l.userId"): TSelf;
		where(lhs: "i.family", op: "=", rhs: "transaction"): TSelf;
		where(lhs: "i.type", op: "=", rhs: "buyer-message"): TSelf;
		where(lhs: "i.archivedAt", op: "is", rhs: null): TSelf;
		where(
			callback: (
				eb: ExpressionBuilder<withUnreadBuyerMessageActivityQuery.Database, "i" | "l">,
			) => RawBuilder<boolean>,
		): TSelf;
	}
}

export const withUnreadBuyerMessageActivityQuery = <
	TQuery extends withUnreadBuyerMessageActivityQuery.Query<TQuery>,
>(
	query: TQuery,
): TQuery => {
	return query
		.whereRef("i.userId", "=", "l.userId")
		.where("i.family", "=", "transaction")
		.where("i.type", "=", "buyer-message")
		.where("i.archivedAt", "is", null)
		.where((eb) => sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`);
};
