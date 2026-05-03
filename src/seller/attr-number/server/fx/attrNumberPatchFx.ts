import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { AttrNumberPatchSchema } from "../schema/AttrNumberPatchSchema";

export namespace attrNumberPatchFx {
	export interface Props extends AttrNumberPatchSchema.Type {
		userId: string;
	}
}

export const attrNumberPatchFx = Effect.fn("attrNumberPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: attrNumberPatchFx.Props) {
	const logger = yield* getLoggerFx("attrNumberPatchFx");
	logger.trace("attrNumberPatchFx", {
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
					.deleteFrom("listing_attr_number")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value !== null) {
				yield* tryDbFx(async () => {
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

export type attrNumberPatchFx = ReturnType<typeof attrNumberPatchFx>;
