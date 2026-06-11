import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { DateServiceFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { TransactionEntrySensitiveKindEnumSchema } from "~/common/user-transaction/enum/TransactionEntrySensitiveKindEnumSchema";
import type { TransactionPatchCollectionSchema } from "~/seller/transaction/server/schema/TransactionPatchCollectionSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { Transitions } from "~/user/transaction/server/fx/transactionTransitionFx";
import { withTransactionSelectFx } from "../db/withTransactionSelectFx";
import type { TransactionWhereSchema } from "../schema/TransactionWhereSchema";

export namespace transactionPatchCollectionFx {
	export interface Props extends TransactionPatchCollectionSchema.Type {
		scope: TransactionWhereSchema.Type;
	}
}

export const transactionPatchCollectionFx = Effect.fn("transactionPatchCollectionFx")(function* ({
	patch,
	query,
	scope,
}: transactionPatchCollectionFx.Props) {
	const logger = yield* getLoggerFx("transactionPatchCollectionFx");
	logger.trace("transactionPatchCollectionFx", {
		patch,
		query,
		scope,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			const dateService = yield* DateServiceFx;
			const now = dateService.now().toJSDate();

			let { select, queryFx } = yield* withTransactionSelectFx({
				sort: query.sort,
			});

			for (const layer of [
				query.where,
				scope,
			]) {
				select = yield* queryFx(select, layer);
			}

			const selectIds = select.clearSelect().select("lt.id");

			const updated = yield* dbFx(async (kysely) => {
				return kysely
					.updateTable("transaction")
					.set({
						...patch,
						updatedAt: now,
						...(patch.status !== undefined && {
							statusUpdatedAt: now,
						}),
					})
					.where("id", "in", selectIds)
					.returning("id")
					.execute();
			});
			const ids = updated.map(({ id }) => id);

			if (ids.length === 0) {
				return [];
			}

			if (
				patch.status !== undefined &&
				Transitions.CleanupSensitiveStatus.includes(patch.status)
			) {
				yield* dbFx(async (kysely) => {
					return kysely
						.deleteFrom("transaction_entry")
						.where("transactionId", "in", ids)
						.where("kind", "in", TransactionEntrySensitiveKindEnumSchema.options)
						.executeTakeFirst();
				});
			}

			return yield* withCollectionFx({
				selectFx: withTransactionSelectFx({
					sort: query.sort,
				}),
				cursor: {
					page: 0,
					size: ids.length,
				},
				where: {
					idIn: ids,
				},
				scope,
			});
		}),
	);
});

export type transactionPatchCollectionFx = ReturnType<typeof transactionPatchCollectionFx>;
