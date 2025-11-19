import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { withListingCartQueryBuilder } from "../db/withListingCartQueryBuilder";
import { withListingCartSelect } from "../db/withListingCartSelect";
import type { ListingCartQuerySchema } from "../schema/ListingCartQuerySchema";
import { ListingCartSchema } from "../schema/ListingCartSchema";

export namespace listingCartFetchFx {
	export interface Props {
		query: Omit<ListingCartQuerySchema.Type, "cursor">;
	}
}

export const listingCartFetchFx = ({ query }: listingCartFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingCartSelect({
					database,
					sort,
				}),
				output: ListingCartSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingCartQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-cart",
				resourceId: "(query)",
				message: "Listing cart not found",
			});
		}

		return data;
	});
};

export type listingCartFetchFx = ReturnType<typeof listingCartFetchFx>;
