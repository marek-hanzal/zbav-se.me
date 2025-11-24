import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { withListingTransactionStatusQueryBuilder } from "~/@user/listing-transaction-status/db/withListingTransactionStatusQueryBuilder";
import { withListingTransactionStatusSelect } from "~/@user/listing-transaction-status/db/withListingTransactionStatusSelect";
import type { ListingTransactionStatusQuerySchema } from "~/@user/listing-transaction-status/schema/ListingTransactionStatusQuerySchema";
import { ListingTransactionStatusSchema } from "~/@user/listing-transaction-status/schema/ListingTransactionStatusSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";

export namespace listingTransactionStatusFetchFx {
	export interface Props {
		query: Omit<ListingTransactionStatusQuerySchema.Type, "cursor">;
	}
}

export const listingTransactionStatusFetchFx = ({
	query,
}: listingTransactionStatusFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingTransactionStatusSelect({
					database,
					sort,
				}),
				output: ListingTransactionStatusSchema,
				filter,
				where,
				query: withListingTransactionStatusQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-transaction-status",
				resourceId: "(query)",
				message: "Listing transaction status not found",
			});
		}

		return data;
	});
};

export type listingTransactionStatusFetchFx = ReturnType<typeof listingTransactionStatusFetchFx>;
