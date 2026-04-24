import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { getLoggerFx } from "@/lib/common/log";
import { draftFetchFx } from "~/seller/draft/server/fx/draftFetchFx";
import type { DraftFilterSchema } from "~/seller/draft/server/schema/DraftFilterSchema";
import type { DraftPatchSchema } from "~/seller/draft/server/schema/DraftPatchSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace draftPatchFx {
	export interface Scope extends DraftFilterSchema.Type {
		userId: string;
	}

	export interface Props extends DraftPatchSchema.Type {
		scope: Scope;
	}
}

export const draftPatchFx = Effect.fn("draftPatchFx")(function* ({
	patch,
	query,
	scope,
}: draftPatchFx.Props) {
	const logger = yield* getLoggerFx("draftPatchFx");
	logger.trace("draftPatchFx", {
		patch,
		query,
		scope,
	});

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
				scope,
			});
		}),
	);
});

export type draftPatchFx = ReturnType<typeof draftPatchFx>;
