import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { AttrEnumSinglePatchSchema } from "../schema/AttrEnumSinglePatchSchema";

export namespace attrEnumSinglePatchFx {
	export interface Props extends AttrEnumSinglePatchSchema.Type {
		userId: string;
	}
}

export const attrEnumSinglePatchFx = Effect.fn("attrEnumSinglePatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: attrEnumSinglePatchFx.Props) {
	const logger = yield* getLoggerFx("attrEnumSinglePatchFx");
	logger.trace("attrEnumSinglePatchFx", {
		listingId,
		fieldId,
		value,
	});

	yield* listingCheckIfOwnFx({
		userId,
		listingId,
		status: [
			"draft",
		],
	});

	const { kysely } = yield* KyselyContextFx;

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* tryDbFx(async () => {
				return kysely
					.deleteFrom("attr_enum_single")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value != null) {
				yield* tryDbFx(async () => {
					return kysely
						.insertInto("attr_enum_single")
						.values({
							fieldId,
							listingId,
							value,
						})
						.execute();
				});
			}
		}),
	);
});

export type attrEnumSinglePatchFx = ReturnType<typeof attrEnumSinglePatchFx>;
