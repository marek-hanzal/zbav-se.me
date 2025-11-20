import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withListingQueryBuilder } from "../db/withListingQueryBuilder";
import { withListingSelect } from "../db/withListingSelect";
import type { ListingCountQuerySchema } from "../schema/ListingCountQuerySchema";

export namespace listingCountFx {
	export interface Props {
		query: ListingCountQuerySchema.Type;
	}
}

export const listingCountFx = ({ query }: listingCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const { filter, where } = query;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withListingSelect({
					database,
					userId: user.id,
					sort: undefined,
					meta: undefined,
				}),
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
	});
};

export type listingCountFx = ReturnType<typeof listingCountFx>;
