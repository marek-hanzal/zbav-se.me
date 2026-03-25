import { Effect } from "effect";
import { inboxFetchFx } from "~/server/@user/inbox/fx/inboxFetchFx";
import type { InboxFilterSchema } from "~/server/@user/inbox/schema/InboxFilterSchema";
import type { InboxPatchSchema } from "~/server/@user/inbox/schema/InboxPatchSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace inboxPatchFx {
	export interface Props extends InboxPatchSchema.Type {
		scope: InboxFilterSchema.Type;
	}
}

export const inboxPatchFx = Effect.fn("inboxPatchFx")(function* ({
	patch,
	query,
	scope,
}: inboxPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			const inbox = yield* inboxFetchFx({
				...query,
				scope,
			});

			yield* tryDbFx(async () =>
				kysely
					.updateTable("inbox")
					.set(patch)
					.where("id", "=", inbox.id)
					.executeTakeFirst(),
			);

			return yield* inboxFetchFx({
				where: {
					id: inbox.id,
				},
				scope: {
					userId: inbox.userId,
				},
			});
		}),
	);
});

export type inboxPatchFx = ReturnType<typeof inboxPatchFx>;
