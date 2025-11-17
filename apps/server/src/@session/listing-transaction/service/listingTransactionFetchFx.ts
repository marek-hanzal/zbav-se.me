import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { NotFoundError } from "../../../error/NotFoundError";
import { withListingTransactionQueryBuilder } from "../db/withListingTransactionQueryBuilder";
import { withListingTransactionSelect } from "../db/withListingTransactionSelect";
import type { ListingTransactionQuerySchema } from "../schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "../schema/ListingTransactionSchema";

export namespace listingTransactionFetchFx {
	export interface Props {
		userId: string;
		query: Omit<ListingTransactionQuerySchema.Type, "cursor">;
	}
}

export const listingTransactionFetchFx = ({ userId, query }: listingTransactionFetchFx.Props) => {
	return Effect.gen(function* () {
		const data = yield* Effect.promise(async () => {
			const { filter, where, sort, meta } = query;

			return withFetch({
				select: withListingTransactionSelect({
					sort,
				}),
				output: ListingTransactionSchema,
				filter,
				where: {
					...where,
					userId,
				},
				query(query) {
					return withListingTransactionQueryBuilder({
						meta,
						...query,
					});
				},
			});
		});

		if (!data) {
			return yield* Effect.fail(
				new NotFoundError({
					resource: "listing-transaction",
					resourceId: "(query)",
					message: "Listing transaction not found",
				}),
			);
		}

		return data;
	});
};

export type listingTransactionFetchFx = ReturnType<typeof listingTransactionFetchFx>;
