import { withCountFx } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingEventQueryBuilder } from "~/app/listing-event/db/withListingEventQueryBuilder";
import { withListingEventSelect } from "~/app/listing-event/db/withListingEventSelect";
import type { ListingEventCountQuerySchema } from "~/app/listing-event/schema/ListingEventCountQuerySchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingEventCountFx {
	export type Props = ListingEventCountQuerySchema.Type;
}

export const listingEventCountFx = Effect.fn("listingEventCountFx")(function* ({
	filter,
	where,
}: listingEventCountFx.Props) {
	const database = yield* DatabaseContextFx;

	return yield* withCountFx({
		select: withListingEventSelect({
			database,
			sort: undefined,
		}),
		filter,
		where,
		query: withListingEventQueryBuilder,
	});
});

export type listingEventCountFx = ReturnType<typeof listingEventCountFx>;
