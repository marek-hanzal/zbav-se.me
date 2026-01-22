import { DateContextFx } from "@use-pico/common/date";
import { Effect } from "effect";
import type { DraftFilterSchema } from "~/@user/draft/schema/DraftFilterSchema";
import type { DraftPatchSchema } from "~/@user/draft/schema/DraftPatchSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { draftFetchFx } from "./draftFetchFx";

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

			yield* Effect.promise(async () => {
				return kysely
					.updateTable("draft")
					.set({
						...patch,
						updatedAt: dateContext.now().toJSDate(),
					})
					.where("id", "=", draft.id)
					.executeTakeFirst();
			});

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
