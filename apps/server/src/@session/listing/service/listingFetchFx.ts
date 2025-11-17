import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { withListingQueryBuilder } from "../db/withListingQueryBuilder";
import { withListingSelect } from "../db/withListingSelect";
import type { ListingQuerySchema } from "../schema/ListingQuerySchema";
import { ListingSchema } from "../schema/ListingSchema";

export namespace listingFetchFx {
	export interface Props {
		userId: string;
		query: Omit<ListingQuerySchema.Type, "cursor">;
	}
}

export const listingFetchFx = ({ userId, query }: listingFetchFx.Props) => {
	return Effect.gen(function* () {
		const data = yield* Effect.promise(async () => {
			const { filter, where, sort, meta } = query;

			return withFetch({
				select: withListingSelect({
					sort,
					meta,
					userId,
				}),
				output: ListingSchema,
				filter,
				where,
				query(query) {
					return withListingQueryBuilder({
						userId,
						...query,
					});
				},
			});
		});

		if (!data) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "listing",
					resourceId: "(query)",
					message: "Listing not found",
				}),
			);
		}

		return data;
	});
};

export type listingFetchFx = ReturnType<typeof listingFetchFx>;
