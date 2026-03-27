import { withCollectionFx } from "@use-pico/common/collection";
import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { withTransactionCollectionSelectFx } from "~/@seller/transaction/server/db/withTransactionCollectionSelectFx";
import { withTransactionQueryBuilderFx } from "~/@seller/transaction/server/db/withTransactionQueryBuilderFx";
import type { TransactionFilterSchema } from "~/@seller/transaction/server/schema/TransactionFilterSchema";
import type { TransactionPatchCollectionSchema } from "~/@seller/transaction/server/schema/TransactionPatchCollectionSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

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
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const now = dateContext.now().toJSDate();

			let select = yield* withTransactionCollectionSelectFx({
				sort: query.sort,
			});

			for (const layer of [
				query.filter,
				query.where,
				scope,
			]) {
				select = yield* withTransactionQueryBuilderFx({
					select,
					where: layer,
				});
			}

			const selectIds = select.clearSelect().select("lt.id");

			const updated = yield* tryDbFx(async () =>
				kysely
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
					.execute(),
			);
			const ids = updated.map(({ id }) => id);

			if (ids.length === 0) {
				return [];
			}

			return yield* withCollectionFx({
				selectFx: withTransactionCollectionSelectFx({
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
				queryFx: withTransactionQueryBuilderFx,
			});
		}),
	);
});

export type transactionPatchCollectionFx = ReturnType<typeof transactionPatchCollectionFx>;
