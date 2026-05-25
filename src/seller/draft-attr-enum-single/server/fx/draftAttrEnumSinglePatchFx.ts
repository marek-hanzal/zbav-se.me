import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { draftCheckIfOwnFx } from "~/seller/draft/server/fx/draftCheckIfOwnFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { DraftAttrEnumSinglePatchSchema } from "../schema/DraftAttrEnumSinglePatchSchema";

export namespace draftAttrEnumSinglePatchFx {
	export interface Props extends DraftAttrEnumSinglePatchSchema.Type {
		userId: string;
	}
}

export const draftAttrEnumSinglePatchFx = Effect.fn("draftAttrEnumSinglePatchFx")(function* ({
	userId,
	draftId,
	fieldId,
	value,
}: draftAttrEnumSinglePatchFx.Props) {
	const logger = yield* getLoggerFx("draftAttrEnumSinglePatchFx");
	logger.trace("draftAttrEnumSinglePatchFx", {
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
					.deleteFrom("draft_attr_enum_single")
					.where("draftId", "=", draftId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value != null) {
				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("draft_attr_enum_single")
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

export type draftAttrEnumSinglePatchFx = ReturnType<typeof draftAttrEnumSinglePatchFx>;
