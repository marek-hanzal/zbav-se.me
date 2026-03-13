import { withCollectionFx } from "@use-pico/common/collection";
import { Effect } from "effect";
import { withInboxCollectionSelectFx } from "~/@user/inbox/db/withInboxCollectionSelectFx";
import { withInboxQueryBuilderFx } from "~/@user/inbox/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/@user/inbox/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/@user/inbox/schema/InboxFilterSchema";
import type { InboxPatchCollectionSchema } from "~/@user/inbox/schema/InboxPatchCollectionSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { tryDbFx } from "~/database/fx/tryDbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { traceLogFx } from "~/effect/traceLogFx";

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
	yield* traceLogFx({
		level: "trace",
		message: "inboxPatchCollectionFx",
		input: {
			patch,
			query,
			scope,
		},
	});

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
