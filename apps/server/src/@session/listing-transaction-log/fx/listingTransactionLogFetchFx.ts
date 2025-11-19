import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { withListingTransactionLogQueryBuilder } from "../db/withListingTransactionLogQueryBuilder";
import { withListingTransactionLogSelect } from "../db/withListingTransactionLogSelect";
import type { ListingTransactionLogQuerySchema } from "../schema/ListingTransactionLogQuerySchema";
import { ListingTransactionLogSchema } from "../schema/ListingTransactionLogSchema";

export namespace listingTransactionLogFetchFx {
	export interface Props {
		query: Omit<ListingTransactionLogQuerySchema.Type, "cursor">;
	}
}

export const listingTransactionLogFetchFx = ({ query }: listingTransactionLogFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingTransactionLogSelect({
					database,
					sort,
				}),
				output: ListingTransactionLogSchema,
				filter,
				where,
				query: withListingTransactionLogQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-transaction-log",
				resourceId: "(query)",
				message: "Listing transaction log not found",
			});
		}

		return data;
	});
};

export type listingTransactionLogFetchFx = ReturnType<typeof listingTransactionLogFetchFx>;
