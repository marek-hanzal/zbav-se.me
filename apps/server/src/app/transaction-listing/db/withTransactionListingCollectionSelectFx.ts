import { Effect } from "effect";
import { withListingCollectionSelectFx } from "~/app/listing/db/withListingCollectionSelectFx";
import type { TransactionListingSortSchema } from "../schema/TransactionListingSortSchema";

export namespace withTransactionListingCollectionSelectFx {
	export interface Props {
		sort?: TransactionListingSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingCollectionSelectFx>
	>;
}

export const withTransactionListingCollectionSelectFx = Effect.fn(
	"withTransactionListingCollectionSelectFx",
)(function* ({ sort }: withTransactionListingCollectionSelectFx.Props) {
	let query = yield* withListingCollectionSelectFx({
		sort,
		meta: undefined,
	});

	query = query.where((eb) =>
		eb.exists((eb) =>
			eb
				.selectFrom("transaction as lt")
				.select("lt.id")
				.whereRef("lt.listingId", "=", "l.id"),
		),
	);

	return query;
});
