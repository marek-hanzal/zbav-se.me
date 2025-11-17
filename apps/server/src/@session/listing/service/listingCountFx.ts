import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { withListingQueryBuilder } from "../db/withListingQueryBuilder";
import { withListingSelect } from "../db/withListingSelect";
import type { ListingCountQuerySchema } from "../schema/ListingCountQuerySchema";

export namespace listingCountFx {
	export interface Props {
		userId: string;
		query: ListingCountQuerySchema.Type;
	}
}

export const listingCountFx = ({ userId, query }: listingCountFx.Props) => {
	return Effect.gen(function* () {
		const { filter, where } = query;

		return yield* Effect.promise(async () => {
			return withCount({
				select: withListingSelect({
					userId,
					sort: undefined,
					meta: undefined,
				}),
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
	});
};

export type listingCountFx = ReturnType<typeof listingCountFx>;
