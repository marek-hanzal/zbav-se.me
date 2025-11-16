import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { ListingTransactionSortSchema } from "../schema/ListingTransactionSortSchema";

export namespace withListingTransactionSelect {
	export interface Props {
		sort: ListingTransactionSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionSelect>;
}

export const withListingTransactionSelect = ({ sort }: withListingTransactionSelect.Props) => {
	let query = database.kysely
		.selectFrom("listing_transaction as lt")
		.innerJoin("listing as l", "lt.listingId", "l.id")
		.select([
			"lt.id",
			"lt.listingId",
			"lt.status",
			"lt.side",
			"lt.createdAt",
			"lt.updatedAt",
			"lt.expiresAt",
			"l.title",
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("lt.createdAt", item.direction))
			.with("updatedAt", () => query.orderBy("lt.updatedAt", item.direction))
			.with("expiresAt", () => query.orderBy("lt.expiresAt", item.direction))
			.exhaustive();
	}

	return query;
};
