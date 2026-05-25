import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { draftCheckIfOwnFx } from "~/seller/draft/server/fx/draftCheckIfOwnFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { DraftAttrEnumMultiPatchSchema } from "../schema/DraftAttrEnumMultiPatchSchema";

export namespace draftAttrEnumMultiPatchFx {
	export interface Props extends DraftAttrEnumMultiPatchSchema.Type {
		userId: string;
	}
}

export const draftAttrEnumMultiPatchFx = Effect.fn("draftAttrEnumMultiPatchFx")(function* ({
	userId,
	draftId,
	fieldId,
	value,
}: draftAttrEnumMultiPatchFx.Props) {
	const logger = yield* getLoggerFx("draftAttrEnumMultiPatchFx");
	logger.trace("draftAttrEnumMultiPatchFx", {
		draftId,
		fieldId,
		value,
	});

	yield* draftCheckIfOwnFx({
		userId,
		draftId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* dbFx(async (kysely) => {
				return kysely
					.deleteFrom("draft_attr_enum_multi")
					.where("draftId", "=", draftId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value.length > 0) {
				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("draft_attr_enum_multi")
						.values(
							value.map((value) => ({
								fieldId,
								draftId,
								value,
							})),
						)
						.execute();
				});
			}
		}),
	);
});

export type draftAttrEnumMultiPatchFx = ReturnType<typeof draftAttrEnumMultiPatchFx>;
