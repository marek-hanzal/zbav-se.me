import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { draftCheckIfOwnFx } from "~/seller-draft/fx/draftCheckIfOwnFx";
import type { DraftAttrDecimalPatchSchema } from "~/seller-draft-attr-decimal/schema/DraftAttrDecimalPatchSchema";

export namespace draftAttrDecimalPatchFx {
	export interface Props extends DraftAttrDecimalPatchSchema.Type {
		userId: string;
	}
}

export const draftAttrDecimalPatchFx = Effect.fn("draftAttrDecimalPatchFx")(function* ({
	userId,
	draftId,
	fieldId,
	value,
}: draftAttrDecimalPatchFx.Props) {
	const logger = yield* getLoggerFx("draftAttrDecimalPatchFx");
	logger.trace("draftAttrDecimalPatchFx", {
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
					.deleteFrom("draft_attr_decimal")
					.where("draftId", "=", draftId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value !== null) {
				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("draft_attr_decimal")
						.values({
							fieldId,
							draftId,
							value,
						})
						.execute();
				});
			}
		}),
	);
});

export type draftAttrDecimalPatchFx = ReturnType<typeof draftAttrDecimalPatchFx>;
