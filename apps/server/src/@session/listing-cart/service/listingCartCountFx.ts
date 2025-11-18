import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";
import { withListingCartQueryBuilder } from "../db/withListingCartQueryBuilder";
import { withListingCartSelect } from "../db/withListingCartSelect";
import type { ListingCartCountQuerySchema } from "../schema/ListingCartCountQuerySchema";

export namespace listingCartCountFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		query: ListingCartCountQuerySchema.Type;
	}
}

export const listingCartCountFx = ({
	database,
	userId,
	query: { filter, where },
}: listingCartCountFx.Props) => {
	return Effect.gen(function* () {
		return yield* Effect.promise(async () => {
			return withCount({
				select: withListingCartSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId,
				},
				query: withListingCartQueryBuilder,
			});
		});
	});
};

export type listingCartCountFx = ReturnType<typeof listingCartCountFx>;
