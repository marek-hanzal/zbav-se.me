import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { AttrEnumMultiPatchSchema } from "../schema/AttrEnumMultiPatchSchema";

export namespace attrEnumMultiPatchFx {
	export interface Props extends AttrEnumMultiPatchSchema.Type {
		userId: string;
	}
}

export const attrEnumMultiPatchFx = Effect.fn("attrEnumMultiPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: attrEnumMultiPatchFx.Props) {
	const logger = yield* getLoggerFx("attrEnumMultiPatchFx");
	logger.trace("attrEnumMultiPatchFx", {
		listingId,
		fieldId,
		value,
	});

	yield* listingCheckIfOwnFx({
		userId,
		listingId,
	});

	const { kysely } = yield* KyselyContextFx;

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* tryDbFx(async () => {
				return kysely
					.deleteFrom("listing_attr_enum_multi")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value.length > 0) {
				yield* tryDbFx(async () => {
					return kysely
						.insertInto("listing_attr_enum_multi")
						.values(
							value.map((value) => ({
								fieldId,
								listingId,
								value,
							})),
						)
						.execute();
				});
			}
		}),
	);
});

export type attrEnumMultiPatchFx = ReturnType<typeof attrEnumMultiPatchFx>;
