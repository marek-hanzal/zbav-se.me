import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ListingEventSortSchema } from "~/app/listing-event/schema/ListingEventSortSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withListingEventSelectFx {
	export interface Props {
		sort: ListingEventSortSchema.Type[] | undefined;
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingEventSelectFx>>;
}

export const withListingEventSelectFx = Effect.fn("withListingEventSelectFx")(function* ({
	sort,
}: withListingEventSelectFx.Props) {
	const database = yield* DatabaseContextFx;
	let query = database.selectFrom("listing_event as le").selectAll("le");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("le.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
