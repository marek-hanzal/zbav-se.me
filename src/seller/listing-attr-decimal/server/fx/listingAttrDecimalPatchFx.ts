import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ListingAttrDecimalPatchSchema } from "../schema/ListingAttrDecimalPatchSchema";

export namespace listingAttrDecimalPatchFx {
	export interface Props extends ListingAttrDecimalPatchSchema.Type {
		userId: string;
	}
}

export const listingAttrDecimalPatchFx = Effect.fn("listingAttrDecimalPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: listingAttrDecimalPatchFx.Props) {
	const logger = yield* getLoggerFx("listingAttrDecimalPatchFx");
	logger.trace("listingAttrDecimalPatchFx", {
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

export type listingAttrDecimalPatchFx = ReturnType<typeof listingAttrDecimalPatchFx>;
