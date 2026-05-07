import { Effect } from "effect";
import { withFetchFx } from "@/lib/common/fetch";
import { getLoggerFx } from "@/lib/common/log";
import { withListingSelectFx } from "~/buyer/listing/server/db/withListingSelectFx";
import type { ListingQuerySchema } from "~/buyer/listing/server/schema/ListingQuerySchema";
import { hasExplicitCategory } from "~/common/listing/util/hasExplicitCategory";
import type { ListingWhereSchema } from "../schema/ListingWhereSchema";

export namespace listingFetchFx {
	export interface Props extends ListingQuerySchema.Type {
		userId: string;
		scope: ListingWhereSchema.Type;
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
	const logger = yield* getLoggerFx("listingFetchFx");
	logger.trace("listingFetchFx", {
		userId,
		filter,
		where,
		scope,
		sort,
		meta,
	});

	return yield* withFetchFx({
		resource: "listing",
		selectFx: withListingSelectFx({
			userId,
			sort,
			meta,
			hasExplicitCategory: hasExplicitCategory([
				filter,
				where,
				scope,
			]),
		}),
		filter,
		where,
		scope,
	});
});

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
