import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingFlagQueryBuilder } from "../db/withListingFlagQueryBuilder";
import { withListingFlagSelect } from "../db/withListingFlagSelect";
import type { ListingFlagCountQuerySchema } from "../schema/ListingFlagCountQuerySchema";

export namespace listingFlagCountFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingFlagCountQuerySchema.Type;
	}
}

export const listingFlagCountFx = ({
	database,
	userId,
	query: { filter, where },
}: listingFlagCountFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCount({
				select: withListingFlagSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId,
				},
				query: withListingFlagQueryBuilder,
			});
		});
	});
};

export type listingFlagCountFx = ReturnType<typeof listingFlagCountFx>;
