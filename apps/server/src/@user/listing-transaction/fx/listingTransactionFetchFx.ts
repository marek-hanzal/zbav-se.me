import { withFetch } from "@use-pico/common/fetch";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import { withListingTransactionQueryBuilder } from "../db/withListingTransactionQueryBuilder";
import { withListingTransactionSelect } from "../db/withListingTransactionSelect";
import type { ListingTransactionQuerySchema } from "../schema/ListingTransactionQuerySchema";
import { ListingTransactionSchema } from "../schema/ListingTransactionSchema";

export namespace listingTransactionFetchFx {
	export interface Props {
		query: Omit<ListingTransactionQuerySchema.Type, "cursor">;
	}
}

export const listingTransactionFetchFx = ({ query }: listingTransactionFetchFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const data = yield* Effect.tryPromise(async () => {
			const { filter, where, sort, meta } = query;

			return withFetch({
				select: withListingTransactionSelect({
					database,
					sort,
				}),
				output: ListingTransactionSchema,
				filter,
				where: {
					...where,
					userId: user.id,
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
			return yield* new NotFoundError({
				resource: "listing-transaction",
				resourceId: "(query)",
				message: "Listing transaction not found",
			});
		}

		return data;
	});
};

export type listingTransactionFetchFx = ReturnType<typeof listingTransactionFetchFx>;
