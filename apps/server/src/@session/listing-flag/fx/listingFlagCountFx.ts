import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/fx/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { withListingFlagQueryBuilder } from "../db/withListingFlagQueryBuilder";
import { withListingFlagSelect } from "../db/withListingFlagSelect";
import type { ListingFlagCountQuerySchema } from "../schema/ListingFlagCountQuerySchema";

export namespace listingFlagCountFx {
	export interface Props {
		query: ListingFlagCountQuerySchema.Type;
	}
}

export const listingFlagCountFx = ({ query: { filter, where } }: listingFlagCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withListingFlagSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingFlagQueryBuilder,
			});
		});
	});
};

export type listingFlagCountFx = ReturnType<typeof listingFlagCountFx>;
