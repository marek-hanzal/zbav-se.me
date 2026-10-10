import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { listingCheckIfOwnFx } from "~/seller-listing/fx/listingCheckIfOwnFx";
import type { ListingAttrTextPatchSchema } from "~/seller-listing-attr-text/schema/ListingAttrTextPatchSchema";

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
