import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { draftCheckIfOwnFx } from "~/seller/draft/server/fx/draftCheckIfOwnFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { DraftAttrDecimalPatchSchema } from "../schema/DraftAttrDecimalPatchSchema";

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
