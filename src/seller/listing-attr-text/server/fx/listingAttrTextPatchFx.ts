import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ListingAttrTextPatchSchema } from "../schema/ListingAttrTextPatchSchema";

export namespace listingAttrTextPatchFx {
	export interface Props extends ListingAttrTextPatchSchema.Type {
		userId: string;
	}
}

export const listingAttrTextPatchFx = Effect.fn("listingAttrTextPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: listingAttrTextPatchFx.Props) {
	const logger = yield* getLoggerFx("listingAttrTextPatchFx");
	logger.trace("listingAttrTextPatchFx", {
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
					.deleteFrom("listing_attr_text")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value != null) {
				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("listing_attr_text")
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

export type listingAttrTextPatchFx = ReturnType<typeof listingAttrTextPatchFx>;
