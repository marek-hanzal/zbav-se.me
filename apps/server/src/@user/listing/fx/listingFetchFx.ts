import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { ListingSchema } from "~/@user/listing/schema/ListingSchema";
import { withListingQueryBuilder } from "~/app/listing/db/withListingQueryBuilder";
import { withListingSelect } from "~/app/listing/db/withListingSelect";
import type { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace listingFetchFx {
	export type Props = ListingQuerySchema.Type;
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	filter,
	where,
	sort,
	meta,
}: listingFetchFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "listing",
		select: withListingSelect({
			database,
			sort,
			meta,
			userId: user.id,
		}),
		output: ListingSchema,
		filter,
		where,
		query(query) {
			return withListingQueryBuilder({
				...query,
				userId: user.id,
				meta,
			});
		},
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
