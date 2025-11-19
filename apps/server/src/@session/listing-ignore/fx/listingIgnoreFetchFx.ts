import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { UserContextFx } from "../../../fx/UserContextFx";
import { withListingIgnoreQueryBuilder } from "../db/withListingIgnoreQueryBuilder";
import { withListingIgnoreSelect } from "../db/withListingIgnoreSelect";
import type { ListingIgnoreQuerySchema } from "../schema/ListingIgnoreQuerySchema";
import { ListingIgnoreSchema } from "../schema/ListingIgnoreSchema";

export namespace listingIgnoreFetchFx {
	export interface Props {
		query: Omit<ListingIgnoreQuerySchema.Type, "cursor">;
	}
}

export const listingIgnoreFetchFx = ({ query }: listingIgnoreFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingIgnoreSelect({
					database,
					sort,
				}),
				output: ListingIgnoreSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingIgnoreQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-ignore",
				resourceId: "(query)",
				message: "Listing ignore not found",
			});
		}

		return data;
	});
};

export type listingIgnoreFetchFx = ReturnType<typeof listingIgnoreFetchFx>;
