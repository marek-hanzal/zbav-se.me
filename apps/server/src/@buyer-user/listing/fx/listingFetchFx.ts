import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/@buyer-user/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/@buyer-user/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/@buyer-user/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/@buyer-user/listing/schema/ListingQuerySchema";
import { withTraceFx } from "~/effect/withTraceFx";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingFilterSchema.Type;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	userId,
	filter,
	where,
	scope,
	sort,
	meta,
}: listingFetchFx.Props) {
	yield* withTraceFx({
		fx: "listingFetchFx",
		input: { userId, filter, where, scope, sort, meta },
	});

	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			userId,
			sort,
			meta,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				userId,
				meta,
			});
		},
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
