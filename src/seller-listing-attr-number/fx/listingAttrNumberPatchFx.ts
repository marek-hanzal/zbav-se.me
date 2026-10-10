import { Effect } from "effect";
import { dbFx } from "~/database/fx/dbFx";
import { withTransactionFx } from "~/database/fx/withTransactionFx";
import { getLoggerFx } from "~/log/fx/getLoggerFx";
import { listingCheckIfOwnFx } from "~/seller-listing/fx/listingCheckIfOwnFx";
import type { ListingAttrNumberPatchSchema } from "~/seller-listing-attr-number/schema/ListingAttrNumberPatchSchema";

export namespace listingAttrNumberPatchFx {
	export interface Props extends ListingAttrNumberPatchSchema.Type {
		userId: string;
	}
}

export const listingAttrNumberPatchFx = Effect.fn("listingAttrNumberPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: listingAttrNumberPatchFx.Props) {
	const logger = yield* getLoggerFx("listingAttrNumberPatchFx");
	logger.trace("listingAttrNumberPatchFx", {
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
					.deleteFrom("listing_attr_number")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value !== null) {
				yield* dbFx(async (kysely) => {
					return kysely
						.insertInto("listing_attr_number")
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

export type listingAttrNumberPatchFx = ReturnType<typeof listingAttrNumberPatchFx>;
