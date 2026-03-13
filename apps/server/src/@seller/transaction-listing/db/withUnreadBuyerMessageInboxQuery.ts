import { sql } from "kysely";

export namespace withUnreadBuyerMessageInboxQuery {
	export interface Query {
		where(...args: unknown[]): Query;
	}
}

export const withUnreadBuyerMessageInboxQuery = <
	TQuery extends withUnreadBuyerMessageInboxQuery.Query,
>(
	query: TQuery,
): TQuery => {
	const builder = query as unknown as {
		whereRef(lhs: string, op: string, rhs: string): unknown;
		where(...args: unknown[]): withUnreadBuyerMessageInboxQuery.Query;
	};
	const unreadQuery = builder.whereRef(
		"i.userId",
		"=",
		"l.userId",
	) as withUnreadBuyerMessageInboxQuery.Query;

	return unreadQuery
		.where("i.family", "=", "transaction")
		.where("i.type", "=", "buyer-message")
		.where("i.archivedAt", "is", null)
		.where(
			(eb: { ref(value: string): unknown }) =>
				sql<boolean>`${eb.ref("i.reference")} @> ARRAY[${eb.ref("l.id")}]::text[]`,
		) as TQuery;
};
