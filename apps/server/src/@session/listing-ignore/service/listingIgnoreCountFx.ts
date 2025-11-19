import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingIgnoreQueryBuilder } from "../db/withListingIgnoreQueryBuilder";
import { withListingIgnoreSelect } from "../db/withListingIgnoreSelect";
import type { ListingIgnoreCountQuerySchema } from "../schema/ListingIgnoreCountQuerySchema";

export namespace listingIgnoreCountFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingIgnoreCountQuerySchema.Type;
	}
}

export const listingIgnoreCountFx = ({
	database,
	userId,
	query: { filter, where },
}: listingIgnoreCountFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCount({
				select: withListingIgnoreSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId,
				},
				query: withListingIgnoreQueryBuilder,
			});
		});
	});
};

export type listingIgnoreCountFx = ReturnType<typeof listingIgnoreCountFx>;
