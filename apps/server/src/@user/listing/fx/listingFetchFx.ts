import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/@user/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/@user/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/app/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		scope?: ListingFilterSchema.Type;
	}
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	filter,
	where,
	scope,
	sort,
	meta,
}: listingFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			sort,
			meta,
		}),
		filter,
		where,
		scope,
		queryFx(query) {
			return withListingQueryBuilderFx({
				...query,
				userId: user.id,
				meta,
			});
		},
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
