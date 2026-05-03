import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ListingAttrEnumSinglePatchSchema } from "../schema/ListingAttrEnumSinglePatchSchema";

export namespace listingAttrEnumSinglePatchFx {
	export interface Props extends ListingAttrEnumSinglePatchSchema.Type {
		userId: string;
	}
}

export const listingAttrEnumSinglePatchFx = Effect.fn("listingAttrEnumSinglePatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: listingAttrEnumSinglePatchFx.Props) {
	const logger = yield* getLoggerFx("listingAttrEnumSinglePatchFx");
	logger.trace("listingAttrEnumSinglePatchFx", {
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
					.deleteFrom("listing_attr_enum_single")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value != null) {
				yield* tryDbFx(async () => {
					return kysely
						.insertInto("listing_attr_enum_single")
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

export type listingAttrEnumSinglePatchFx = ReturnType<typeof listingAttrEnumSinglePatchFx>;
