import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { AttrDecimalPatchSchema } from "../schema/AttrDecimalPatchSchema";

export namespace attrDecimalPatchFx {
	export interface Props extends AttrDecimalPatchSchema.Type {
		userId: string;
	}
}

export const attrDecimalPatchFx = Effect.fn("attrDecimalPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: attrDecimalPatchFx.Props) {
	const logger = yield* getLoggerFx("attrDecimalPatchFx");
	logger.trace("attrDecimalPatchFx", {
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
					.deleteFrom("listing_attr_decimal")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value !== null) {
				yield* tryDbFx(async () => {
					return kysely
						.insertInto("listing_attr_decimal")
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

export type attrDecimalPatchFx = ReturnType<typeof attrDecimalPatchFx>;
