import { withCount } from "@use-pico/common/count";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingCartQueryBuilder } from "../db/withListingCartQueryBuilder";
import { withListingCartSelect } from "../db/withListingCartSelect";
import type { ListingCartCountQuerySchema } from "../schema/ListingCartCountQuerySchema";

export namespace listingCartCountFx {
	export interface Props {
		query: ListingCartCountQuerySchema.Type;
	}
}

export const listingCartCountFx = ({ query: { filter, where } }: listingCartCountFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		return yield* Effect.tryPromise(async () => {
			return withCount({
				select: withListingCartSelect({
					database,
					sort: undefined,
				}),
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingCartQueryBuilder,
			});
		});
	});
};

export type listingCartCountFx = ReturnType<typeof listingCartCountFx>;
