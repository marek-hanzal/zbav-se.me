import { Effect } from "effect";
import { withCollectionFx } from "@/lib/common/collection";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import type { TransactionFilterSchema } from "~/seller/transaction/server/schema/TransactionFilterSchema";
import type { TransactionPatchCollectionSchema } from "~/seller/transaction/server/schema/TransactionPatchCollectionSchema";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { withTransactionSelectFx } from "../db/withTransactionSelectFx";

export namespace transactionPatchCollectionFx {
	export interface Props extends TransactionPatchCollectionSchema.Type {
		scope: TransactionFilterSchema.Type;
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
			const dateContext = yield* DateContextFx;
			const now = dateContext.now().toJSDate();

			let { select, queryFx } = yield* withTransactionSelectFx({
				sort: query.sort,
			});

			for (const layer of [
				query.filter,
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
