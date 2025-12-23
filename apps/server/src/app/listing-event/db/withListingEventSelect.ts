import { match } from "ts-pattern";
import type { ListingEventSortSchema } from "~/app/listing-event/schema/ListingEventSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withListingEventSelect {
	export interface Props {
		database: WithDatabase;
		sort: ListingEventSortSchema.Type[] | undefined;
	}

	export type Select = ReturnType<typeof withListingEventSelect>;
}

export const withListingEventSelect = ({ database, sort }: withListingEventSelect.Props) => {
	let query = database.selectFrom("listing_event as le").selectAll("le");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("le.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
