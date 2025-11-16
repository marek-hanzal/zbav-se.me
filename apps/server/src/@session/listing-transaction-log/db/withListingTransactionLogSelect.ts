import { match } from "ts-pattern";
import { database } from "../../../database/kysely";
import type { ListingTransactionLogSortSchema } from "../schema/ListingTransactionLogSortSchema";

export namespace withListingTransactionLogSelect {
	export interface Props {
		sort: ListingTransactionLogSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingTransactionLogSelect>;
}

export const withListingTransactionLogSelect = ({
	sort,
}: withListingTransactionLogSelect.Props) => {
	let query = database.kysely.selectFrom("listing_transaction_log as ltl").select([
		"ltl.id",
		"ltl.listingTransactionId",
		"ltl.status",
		"ltl.side",
		"ltl.createdAt",
	]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("ltl.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
