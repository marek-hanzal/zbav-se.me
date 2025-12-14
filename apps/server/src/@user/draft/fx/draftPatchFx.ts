import { Effect } from "effect";
import { draftFetchFx } from "~/@user/draft/fx/draftFetchFx";
import type { DraftPatchSchema } from "~/@user/draft/schema/DraftPatchSchema";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";

export namespace draftPatchFx {
	export type Props = DraftPatchSchema.Type;
}

export const draftPatchFx = ({ patch, query }: draftPatchFx.Props) => {
	return withTransactionFx(
		Effect.gen(function* () {
			const database = yield* DatabaseContextFx;

			const draft = yield* draftFetchFx(query);

			yield* Effect.tryPromise(async () => {
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
			});
		}),
	);
};

export type draftPatchFx = ReturnType<typeof draftPatchFx>;
