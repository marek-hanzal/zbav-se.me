import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withInboxCollectionSelectFx } from "~/@user/inbox/server/db/withInboxCollectionSelectFx";
import { withInboxQueryBuilderFx } from "~/@user/inbox/server/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/@user/inbox/server/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/@user/inbox/server/schema/InboxFilterSchema";
import type { InboxPatchCollectionSchema } from "~/@user/inbox/server/schema/InboxPatchCollectionSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace inboxPatchCollectionFx {
	export interface Props extends InboxPatchCollectionSchema.Type {
		scope: InboxFilterSchema.Type;
	}
}

export const inboxPatchCollectionFx = Effect.fn("inboxPatchCollectionFx")(function* ({
	patch,
	query,
	scope,
}: inboxPatchCollectionFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			let select = yield* withInboxSelectFx({
				sort: query.sort,
			});

			for (const layer of [
				query.filter,
				query.where,
				scope,
			]) {
				select = yield* withInboxQueryBuilderFx({
					select,
					where: layer,
				});
			}

			const selectIds = select.clearSelect().select("i.id");

			const updated = yield* tryDbFx(async () =>
				kysely
					.updateTable("inbox")
					.set(patch)
					.where("id", "in", selectIds)
					.returning("id")
					.execute(),
			);
			const ids = updated.map(({ id }) => id);

			if (ids.length === 0) {
				return [];
			}

			return yield* withCollectionFx({
				selectFx: withInboxCollectionSelectFx({
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
				queryFx: withInboxQueryBuilderFx,
			});
		}),
	);
});

export type inboxPatchCollectionFx = ReturnType<typeof inboxPatchCollectionFx>;
