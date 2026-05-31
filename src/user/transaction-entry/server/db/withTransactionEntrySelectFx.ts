import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { TransactionEntryDirectionEnumSchema } from "~/user/transaction-entry/server/schema/TransactionEntryDirectionEnumSchema";
import type { TransactionEntrySchema } from "~/user/transaction-entry/server/schema/TransactionEntrySchema";
import type { TransactionEntrySortSchema } from "~/user/transaction-entry/server/schema/TransactionEntrySortSchema";
import type { TransactionEntryWhereSchema } from "../schema/TransactionEntryWhereSchema";

export namespace withTransactionEntrySelectFx {
	export interface Props {
		userId: string;
		sort?: TransactionEntrySortSchema.Type[];
	}
}

export const withTransactionEntrySelectFx = Effect.fn("withTransactionEntrySelectFx")(function* ({
	userId,
	sort,
}: withTransactionEntrySelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely
		.selectFrom("transaction_entry as te")
		.innerJoin("transaction as t", "t.id", "te.transactionId")
		.selectAll("te")
		.select("t.listingId")
		.select((eb) => {
			return eb
				.case()
				.when("te.userId", "is", null)
				.then(TransactionEntryDirectionEnumSchema.enum.system)
				.when("te.userId", "=", userId)
				.then(TransactionEntryDirectionEnumSchema.enum.out)
				.else(TransactionEntryDirectionEnumSchema.enum.in)
				.end()
				.$castTo<TransactionEntryDirectionEnumSchema.Type>()
				.as("direction");
		})
		.$castTo<TransactionEntrySchema.Type>();

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("id", () => select.orderBy("te.id", item.order))
			.with("createdAt", () => select.orderBy("te.createdAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select,
		queryFx(select, where: TransactionEntryWhereSchema.Type) {
			return Effect.gen(function* () {
				let query = select.where((eb) => {
					return eb.exists((eb) => {
						return eb
							.selectFrom("transaction_user as tu")
							.select("tu.userId")
							.whereRef("tu.transactionId", "=", "te.transactionId")
							.where("tu.userId", "=", userId);
					});
				});

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
				query = query.where((eb) => {
					return eb.or([
						eb("te.userId", "=", userId),
						eb("te.kind", "!=", "text"),
						eb.not(
							eb.exists(
								eb
									.selectFrom("transaction as lt")
									.innerJoin(
										"transaction_user as tu",
										"tu.transactionId",
										"lt.id",
									)
									.select("lt.id")
									.whereRef("lt.id", "=", "te.transactionId")
									.where("lt.status", "=", "interest")
									.where("tu.userId", "=", userId)
									.where("tu.side", "=", "seller"),
							),
						),
					]);
				});

				if (!where) {
					return yield* Effect.succeed(query);
				}

				if (where.id) {
					query = query.where("te.id", "=", where.id);
				}

				if (where.idIn?.length) {
					query = query.where("te.id", "in", where.idIn);
				}

				if (where.transactionId) {
					query = query.where("te.transactionId", "=", where.transactionId);
				}

				if (where.transactionIdIn?.length) {
					query = query.where("te.transactionId", "in", where.transactionIdIn);
				}

				if (where.userId) {
					query = query.where("te.userId", "=", where.userId);
				}

				if (where.kind) {
					query = query.where("te.kind", "=", where.kind);
				}

				if (where.kindIn?.length) {
					query = query.where("te.kind", "in", where.kindIn);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
