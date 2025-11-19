import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "../../../auth/UserContextFx";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { withListingFlagQueryBuilder } from "../db/withListingFlagQueryBuilder";
import { withListingFlagSelect } from "../db/withListingFlagSelect";
import type { ListingFlagQuerySchema } from "../schema/ListingFlagQuerySchema";
import { ListingFlagSchema } from "../schema/ListingFlagSchema";

export namespace listingFlagFetchFx {
	export interface Props {
		query: Omit<ListingFlagQuerySchema.Type, "cursor">;
	}
}

export const listingFlagFetchFx = ({ query }: listingFlagFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingFlagSelect({
					database,
					sort,
				}),
				output: ListingFlagSchema,
				filter,
				where: {
					...where,
					userId: user.id,
				},
				query: withListingFlagQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-flag",
				resourceId: "(query)",
				message: "Listing flag not found",
			});
		}

		return data;
	});
};

export type listingFlagFetchFx = ReturnType<typeof listingFlagFetchFx>;
