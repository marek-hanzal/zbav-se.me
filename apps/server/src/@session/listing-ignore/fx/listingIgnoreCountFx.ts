import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingIgnoreQueryBuilder } from "../db/withListingIgnoreQueryBuilder";
import { withListingIgnoreSelect } from "../db/withListingIgnoreSelect";
import type { ListingIgnoreCountQuerySchema } from "../schema/ListingIgnoreCountQuerySchema";

export namespace listingIgnoreCountFx {
	export interface Props {
		query: ListingIgnoreCountQuerySchema.Type;
	}
}

export const listingIgnoreCountFx = ({ query: { filter, where } }: listingIgnoreCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withListingIgnoreSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingIgnoreQueryBuilder,
			});
		});
	});
};

export type listingIgnoreCountFx = ReturnType<typeof listingIgnoreCountFx>;
