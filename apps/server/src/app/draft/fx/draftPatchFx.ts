import type { AssertNever } from "@use-pico/common/type";
import { Effect } from "effect";
import type { DraftPatchSchema } from "~/@user/draft/schema/DraftPatchSchema";
import { draftFetchFx } from "~/app/draft/fx/draftFetchFx";
import type { DraftFilterSchema } from "~/app/draft/schema/DraftFilterSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

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
			const database = yield* DatabaseContextFx;

			const draft = yield* draftFetchFx({
				...query,
				scope,
			});

			yield* Effect.promise(async () => {
				return database
					.updateTable("draft")
					.set({
						...patch,
						updatedAt: new Date(),
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

