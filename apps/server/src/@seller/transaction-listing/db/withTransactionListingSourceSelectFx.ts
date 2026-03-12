import { Effect } from "effect";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withTransactionListingSourceSelectFx {
	export type Props = {};

	export type Select = Effect.Effect.Success<
		ReturnType<typeof withTransactionListingSourceSelectFx>
	>;
}

export const withTransactionListingSourceSelectFx = Effect.fn(
	"withTransactionListingSourceSelectFx",
)(function* (_props: withTransactionListingSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	return kysely
		.selectFrom("listing as l")
		.where(({ exists, selectFrom }) =>
			exists(
				selectFrom("transaction as lt")
					.select("lt.id")
					.whereRef("lt.listingId", "=", "l.id"),
			),
		);
});
