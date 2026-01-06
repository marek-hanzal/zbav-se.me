import { withFetchFx } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { ListingSchema } from "~/@user/listing/schema/ListingSchema";
import { withListingQueryBuilder } from "~/app/listing/db/withListingQueryBuilder";
import { withListingSelectFx } from "~/app/listing/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/app/listing/schema/ListingQuerySchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";

export namespace listingFetchFx {
	export type Props = ListingQuerySchema.Type;
}

export const listingFetchFx = Effect.fn("listingFetchFx")(function* ({
	filter,
	where,
	sort,
	meta,
}: listingFetchFx.Props) {
	const user = yield* UserContextFx;

	return yield* withFetchFx({
		resource: "listing",
		select: yield* withListingSelectFx({
			sort,
			meta,
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
