import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { withInboxQueryBuilderFx } from "~/server/@user/inbox/db/withInboxQueryBuilderFx";
import { withInboxSelectFx } from "~/server/@user/inbox/db/withInboxSelectFx";
import type { InboxFilterSchema } from "~/server/@user/inbox/schema/InboxFilterSchema";
import type { InboxQuerySchema } from "~/server/@user/inbox/schema/InboxQuerySchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace inboxArchiveFx {
	export interface Props extends InboxQuerySchema.Type {
		scope: InboxFilterSchema.Type;
	}
}

export const inboxArchiveFx = Effect.fn("inboxArchiveFx")(function* ({
	cursor,
	filter,
	where,
	scope,
	sort,
}: inboxArchiveFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;
			const cursorValue = cursor ?? {
				page: 0,
				size: 1000,
			};

			let select = yield* withInboxSelectFx({
				sort,
			});

			for (const layer of [
				filter,
				where,
				scope,
			]) {
				select = yield* withInboxQueryBuilderFx({
					select,
					where: layer,
				});
			}

			const archivedAt = dateContext.now().toJSDate();
			const selectIds = select
				.clearSelect()
				.select("i.id")
				.limit(cursorValue.size)
				.offset(cursorValue.page * cursorValue.size);

			yield* tryDbFx(async () =>
				kysely
					.updateTable("inbox")
					.set({
						archivedAt,
					})
					.where("inbox.id", "in", selectIds)
					.execute(),
			);
		}),
	);
});

export type inboxArchiveFx = ReturnType<typeof inboxArchiveFx>;
