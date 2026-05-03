import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
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

	const { kysely } = yield* KyselyContextFx;

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* tryDbFx(async () => {
				return kysely
					.deleteFrom("listing_attr_text")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value != null) {
				yield* tryDbFx(async () => {
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
