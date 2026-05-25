import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { dbFx } from "~/server/database/fx/dbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { ListingAttrNumberPatchSchema } from "../schema/ListingAttrNumberPatchSchema";

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
