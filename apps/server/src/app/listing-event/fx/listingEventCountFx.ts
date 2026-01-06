import { withCountFx } from "@use-pico/common/count";
import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import { withListingEventQueryBuilderFx } from "~/app/listing-event/db/withListingEventQueryBuilderFx";
import { withListingEventSelectFx } from "~/app/listing-event/db/withListingEventSelectFx";
import type { ListingEventCountQuerySchema } from "~/app/listing-event/schema/ListingEventCountQuerySchema";
import type { ListingEventFilterSchema } from "~/app/listing-event/schema/ListingEventFilterSchema";
import type { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace listingEventCountFx {
	export interface Props extends ListingEventCountQuerySchema.Type {
		scope: ListingEventFilterSchema.Type;
	}
}

export const listingEventCountFx = Effect.fn("listingEventCountFx")(function* ({
	filter,
	where,
	scope,
}: listingEventCountFx.Props) {
	return yield* withCountFx({
		selectFx: withListingEventSelectFx({}),
		filter,
		where,
		scope,
		queryFx: withListingEventQueryBuilderFx,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;

type _NoUser = AssertNever<Extract<Effect.Effect.Context<listingEventCountFx>, UserContextFx>>;
