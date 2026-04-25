import { Effect } from "effect";
import type { withTransactionEntrySelectFx } from "~/user/transaction-entry/server/db/withTransactionEntrySelectFx";
import type { TransactionEntryFilterSchema } from "~/user/transaction-entry/server/schema/TransactionEntryFilterSchema";

export namespace withTransactionEntryQueryBuilderFx {
	export interface Props<TSelect extends withTransactionEntrySelectFx.Select> {
		userId: string;
		select: TSelect;
		where?: TransactionEntryFilterSchema.Type;
	}
}

export const withTransactionEntryQueryBuilderFx = Effect.fn("withTransactionEntryQueryBuilderFx")(
	function* <TSelect extends withTransactionEntrySelectFx.Select>({
		userId,
		select,
		where,
	}: withTransactionEntryQueryBuilderFx.Props<TSelect>) {
		let query = select.where((eb) =>
			eb.exists((eb) =>
				eb
					.selectFrom("transaction_user as tu")
					.select("tu.userId")
					.whereRef("tu.transactionId", "=", "te.transactionId")
					.where("tu.userId", "=", userId),
			),
		) as TSelect;

		/**
		 * Hide buyer-authored interest-buffer text from the seller until the trade opens.
		 *
		 * Buyers are allowed to write text while the transaction is still in `interest`.
		 * That content is intentionally a buyer-side buffer: it must be persisted for the
		 * buyer, but it must not become visible to the seller before the seller promotes
		 * the transaction to `trade`.
		 *
		 * The first participant check above only proves that the viewer belongs to the
		 * transaction. Without this extra predicate, a seller could read buffered buyer text
		 * through the normal transaction entry collection/fetch paths, even though
		 * we suppress seller activity notifications for those entries. That would turn the
		 * anti-spam rule into a quiet data leak.
		 *
		 * Visibility rules:
		 * - own entries are always visible,
		 * - non-text entries are always visible, including status entries like
		 *   `status-interest`,
		 * - counterparty text is visible except when the viewer is the seller and the
		 *   transaction is still in `interest`.
		 */
		query = query.where((eb) =>
			eb.or([
				eb("te.userId", "=", userId),
				eb("te.kind", "!=", "text"),
				eb.not(
					eb.exists(
						eb
							.selectFrom("transaction as lt")
							.innerJoin("transaction_user as tu", "tu.transactionId", "lt.id")
							.select("lt.id")
							.whereRef("lt.id", "=", "te.transactionId")
							.where("lt.status", "=", "interest")
							.where("tu.userId", "=", userId)
							.where("tu.side", "=", "seller"),
					),
				),
			]),
		) as TSelect;

		if (!where) {
			return yield* Effect.succeed(query);
		}

		if (where.id) {
			query = query.where("te.id", "=", where.id) as TSelect;
		}

		if (where.idIn?.length) {
			query = query.where("te.id", "in", where.idIn) as TSelect;
		}

		if (where.transactionId) {
			query = query.where("te.transactionId", "=", where.transactionId) as TSelect;
		}

		if (where.transactionIdIn?.length) {
			query = query.where("te.transactionId", "in", where.transactionIdIn) as TSelect;
		}

		if (where.userId) {
			query = query.where("te.userId", "=", where.userId) as TSelect;
		}

		if (where.kind) {
			query = query.where("te.kind", "=", where.kind) as TSelect;
		}

		if (where.kindIn?.length) {
			query = query.where("te.kind", "in", where.kindIn) as TSelect;
		}

		return yield* Effect.succeed(query);
	},
);
