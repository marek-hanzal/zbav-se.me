import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { withListingTransactionGalleryQueryBuilder } from "../db/withListingTransactionGalleryQueryBuilder";
import { withListingTransactionGallerySelect } from "../db/withListingTransactionGallerySelect";
import type { ListingTransactionGalleryQuerySchema } from "../schema/ListingTransactionGalleryQuerySchema";
import { ListingTransactionGallerySchema } from "../schema/ListingTransactionGallerySchema";

export namespace listingTransactionGalleryFetchFx {
	export interface Props {
		query: Omit<ListingTransactionGalleryQuerySchema.Type, "cursor">;
	}
}

export const listingTransactionGalleryFetchFx = ({
	query,
}: listingTransactionGalleryFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingTransactionGallerySelect({
					database,
					sort,
				}),
				output: ListingTransactionGallerySchema,
				filter,
				where,
				query: withListingTransactionGalleryQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-transaction-gallery",
				resourceId: "(query)",
				message: "Listing transaction gallery not found",
			});
		}

		return data;
	});
};

export type listingTransactionGalleryFetchFx = ReturnType<typeof listingTransactionGalleryFetchFx>;
