import { Effect } from "effect";
import { match } from "ts-pattern";
import type { ListingEventSortSchema } from "~/app/listing-event/schema/ListingEventSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withListingEventSourceSelectFx {
	export interface Props {
		sort?: ListingEventSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withListingEventSourceSelectFx>>;
}

export const withListingEventSourceSelectFx = Effect.fn("withListingEventSourceSelectFx")(
	function* ({ sort }: withListingEventSourceSelectFx.Props) {
		const { kysely } = yield* KyselyContextFx;

		let query = kysely.selectFrom("listing_event as le");

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("createdAt", () => query.orderBy("le.createdAt", item.direction))
				.exhaustive();
		}

		return query;
	},
);
