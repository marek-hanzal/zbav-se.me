import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingTransactionLocationQueryBuilder } from "~/@user/listing-transaction-location/db/withListingTransactionLocationQueryBuilder";
import { withListingTransactionLocationSelect } from "~/@user/listing-transaction-location/db/withListingTransactionLocationSelect";
import type { ListingTransactionLocationQuerySchema } from "~/@user/listing-transaction-location/schema/ListingTransactionLocationQuerySchema";
import { ListingTransactionLocationSchema } from "~/@user/listing-transaction-location/schema/ListingTransactionLocationSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace listingTransactionLocationFetchFx {
	export interface Props {
		query: Omit<ListingTransactionLocationQuerySchema.Type, "cursor">;
	}
}

export const listingTransactionLocationFetchFx = ({
	query,
}: listingTransactionLocationFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingTransactionLocationSelect({
					database,
					sort,
				}),
				output: ListingTransactionLocationSchema,
				filter,
				where,
				query: withListingTransactionLocationQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-transaction-location",
				resourceId: "(query)",
				message: "Listing transaction location not found",
			});
		}

		return data;
	});
};

export type listingTransactionLocationFetchFx = ReturnType<
	typeof listingTransactionLocationFetchFx
>;
