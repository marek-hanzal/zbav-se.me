import type { ExpressionBuilder, RawBuilder } from "kysely";
import { sql } from "kysely";
import type { InboxTableSchema } from "~/database/@table/InboxTableSchema";
import type { ListingTableSchema } from "~/database/@table/ListingTableSchema";

export namespace withUnreadBuyerMessageInboxQuery {
	export interface Database {
		i: InboxTableSchema.Type;
		l: ListingTableSchema.Type;
	}

	export interface Query<TSelf> {
		whereRef(lhs: "i.userId", op: "=", rhs: "l.userId"): TSelf;
		where(lhs: "i.family", op: "=", rhs: "transaction"): TSelf;
		where(lhs: "i.type", op: "=", rhs: "buyer-message"): TSelf;
		where(lhs: "i.archivedAt", op: "is", rhs: null): TSelf;
		where(
			callback: (
				eb: ExpressionBuilder<withUnreadBuyerMessageInboxQuery.Database, "i" | "l">,
			) => RawBuilder<boolean>,
		): TSelf;
	}
}

export const withUnreadBuyerMessageInboxQuery = <
	TQuery extends withUnreadBuyerMessageInboxQuery.Query<TQuery>,
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
