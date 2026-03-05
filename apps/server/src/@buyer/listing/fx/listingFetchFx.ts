import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/@buyer/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/@buyer/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/@buyer/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/@buyer/listing/schema/ListingQuerySchema";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "listingFetchFx",
		input: {
			userId,
			filter,
			where,
			scope,
			sort,
			meta,
		},
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
