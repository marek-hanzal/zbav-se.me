import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingQueryBuilder } from "../db/withListingQueryBuilder";
import { withListingSelect } from "../db/withListingSelect";
import type { ListingQuerySchema } from "../schema/ListingQuerySchema";
import { ListingSchema } from "../schema/ListingSchema";

export namespace listingFetchFx {
	export interface Props {
		query: Omit<ListingQuerySchema.Type, "cursor">;
	}
}

export const listingFetchFx = ({ query }: listingFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.promise(async () => {
			const { filter, where, sort, meta } = query;

			return withFetch({
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
					});
				},
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing",
				resourceId: "(query)",
				message: "Listing not found",
			});
		}

		return data;
	});
};

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
