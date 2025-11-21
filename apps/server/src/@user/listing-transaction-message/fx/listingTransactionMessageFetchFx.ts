import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { NotFoundError } from "../../../error/NotFoundError";
import { withListingTransactionMessageQueryBuilder } from "../db/withListingTransactionMessageQueryBuilder";
import { withListingTransactionMessageSelect } from "../db/withListingTransactionMessageSelect";
import type { ListingTransactionMessageQuerySchema } from "../schema/ListingTransactionMessageQuerySchema";
import { ListingTransactionMessageSchema } from "../schema/ListingTransactionMessageSchema";

export namespace listingTransactionMessageFetchFx {
	export interface Props {
		query: Omit<ListingTransactionMessageQuerySchema.Type, "cursor">;
	}
}

export const listingTransactionMessageFetchFx = ({
	query,
}: listingTransactionMessageFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort } = query;

			return withFetch({
				select: withListingTransactionMessageSelect({
					database,
					sort,
				}),
				output: ListingTransactionMessageSchema,
				filter,
				where,
				query: withListingTransactionMessageQueryBuilder,
			});
		});

		if (!data) {
			return yield* new NotFoundError({
				resource: "listing-transaction-message",
				resourceId: "(query)",
				message: "Listing transaction message not found",
			});
		}

		return data;
	});
};

export type listingTransactionMessageFetchFx = ReturnType<typeof listingTransactionMessageFetchFx>;
