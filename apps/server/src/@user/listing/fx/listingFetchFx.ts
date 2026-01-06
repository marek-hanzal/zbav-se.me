import { withFetchFx } from "@use-pico/common/fetch";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withListingQueryBuilderFx } from "~/@user/listing/db/withListingQueryBuilderFx";
import { withListingSelectFx } from "~/@user/listing/db/withListingSelectFx";
import type { ListingFilterSchema } from "~/app/listing/schema/ListingFilterSchema";
import type { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

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

type _NoUser = AssertNever<Extract<Effect.Effect.Context<listingFetchFx>, UserContextFx>>;
