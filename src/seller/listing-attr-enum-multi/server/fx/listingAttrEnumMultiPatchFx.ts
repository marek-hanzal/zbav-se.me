import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ListingAttrEnumMultiPatchSchema } from "../schema/ListingAttrEnumMultiPatchSchema";

export namespace listingAttrEnumMultiPatchFx {
	export interface Props extends ListingAttrEnumMultiPatchSchema.Type {
		userId: string;
	}
}

export const listingAttrEnumMultiPatchFx = Effect.fn("listingAttrEnumMultiPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: listingAttrEnumMultiPatchFx.Props) {
	const logger = yield* getLoggerFx("listingAttrEnumMultiPatchFx");
	logger.trace("listingAttrEnumMultiPatchFx", {
		listingId,
		fieldId,
		value,
	});

	yield* listingCheckIfOwnFx({
		userId,
		listingId,
	});

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* dbFx(async (kysely) => {
				return kysely
					.deleteFrom("listing_attr_enum_multi")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value.length > 0) {
				yield* dbFx(async (kysely) => {
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

export type listingAttrEnumMultiPatchFx = ReturnType<typeof listingAttrEnumMultiPatchFx>;
