import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import { draftFetchFx } from "~/client/@seller/draft/server/fx/draftFetchFx";
import type { DraftFilterSchema } from "~/client/@seller/draft/server/schema/DraftFilterSchema";
import type { DraftPatchSchema } from "~/client/@seller/draft/server/schema/DraftPatchSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace draftPatchFx {
	export interface Props extends DraftPatchSchema.Type {
		scope: DraftFilterSchema.Type;
	}
}

export const draftPatchFx = Effect.fn("draftPatchFx")(function* ({
	patch,
	query,
	scope,
}: draftPatchFx.Props) {
	return yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;
			const dateContext = yield* DateContextFx;

			const draft = yield* draftFetchFx({
				...query,
				scope,
			});

			yield* tryDbFx(async () =>
				kysely
					.updateTable("draft")
					.set({
						...patch,
						updatedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", draft.id)
					.executeTakeFirst(),
			);

			return yield* draftFetchFx({
				where: {
					id: draft.id,
				},
				scope: {},
			});
		}),
	);
});

export type draftPatchFx = ReturnType<typeof draftPatchFx>;
