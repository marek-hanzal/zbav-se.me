import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { draftCheckIfOwnFx } from "~/seller-draft/fx/draftCheckIfOwnFx";
import type { DraftAttrTextPatchSchema } from "~/seller-draft-attr-text/schema/DraftAttrTextPatchSchema";

export namespace draftAttrTextPatchFx {
	export interface Props extends DraftAttrTextPatchSchema.Type {
		userId: string;
	}
}

export const draftAttrTextPatchFx = Effect.fn("draftAttrTextPatchFx")(function* ({
	userId,
	draftId,
	fieldId,
	value,
}: draftAttrTextPatchFx.Props) {
	const logger = yield* getLoggerFx("draftAttrTextPatchFx");
	logger.trace("draftAttrTextPatchFx", {
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
					.deleteFrom("draft_attr_text")
					.where("draftId", "=", draftId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value != null) {
				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("draft_attr_text")
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

export type draftAttrTextPatchFx = ReturnType<typeof draftAttrTextPatchFx>;
