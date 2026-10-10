import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { draftCheckIfOwnFx } from "~/seller-draft/fx/draftCheckIfOwnFx";
import type { DraftAttrNumberPatchSchema } from "~/seller-draft-attr-number/schema/DraftAttrNumberPatchSchema";

export namespace draftAttrNumberPatchFx {
	export interface Props extends DraftAttrNumberPatchSchema.Type {
		userId: string;
	}
}

export const draftAttrNumberPatchFx = Effect.fn("draftAttrNumberPatchFx")(function* ({
	userId,
	draftId,
	fieldId,
	value,
}: draftAttrNumberPatchFx.Props) {
	const logger = yield* getLoggerFx("draftAttrNumberPatchFx");
	logger.trace("draftAttrNumberPatchFx", {
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
					.deleteFrom("draft_attr_number")
					.where("draftId", "=", draftId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value !== null) {
				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("draft_attr_number")
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

export type draftAttrNumberPatchFx = ReturnType<typeof draftAttrNumberPatchFx>;
