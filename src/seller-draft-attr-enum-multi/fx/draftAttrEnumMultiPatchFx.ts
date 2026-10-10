import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { draftCheckIfOwnFx } from "~/seller-draft/fx/draftCheckIfOwnFx";
import type { DraftAttrEnumMultiPatchSchema } from "~/seller-draft-attr-enum-multi/schema/DraftAttrEnumMultiPatchSchema";

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
