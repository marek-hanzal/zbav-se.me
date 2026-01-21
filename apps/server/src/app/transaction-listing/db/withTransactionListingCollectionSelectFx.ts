import { Effect } from "effect";
import { sql } from "kysely";
import { withTransactionListingSourceSelectFx } from "~/app/transaction-listing/db/withTransactionListingSourceSelectFx";

export namespace withTransactionListingCollectionSelectFx {
	export interface Props extends withTransactionListingSourceSelectFx.Props {}

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingCollectionSelectFx>
	>;
}

export const withTransactionListingCollectionSelectFx = Effect.fn(
	"withTransactionListingCollectionSelectFx",
)(function* ({ sort }: withTransactionListingCollectionSelectFx.Props) {
	const sourceSelect = yield* withTransactionListingSourceSelectFx({
		sort,
	});

	return sourceSelect.select((eb) => [
		eb.ref("l.id").as("listingId"),
		sql<number>`count(${eb.ref("lt.id")})`.as("count"),
		sql<Date>`max(${eb.ref("lt.updatedAt")})`.as("lastAt"),
	]);
});
