import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { listingCheckIfOwnFx } from "~/seller/listing/server/fx/listingCheckIfOwnFx";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { AttrTextPatchSchema } from "../schema/AttrTextPatchSchema";

export namespace attrTextPatchFx {
	export interface Props extends AttrTextPatchSchema.Type {
		userId: string;
	}
}

export const attrTextPatchFx = Effect.fn("attrTextPatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: attrTextPatchFx.Props) {
	const logger = yield* getLoggerFx("attrTextPatchFx");
	logger.trace("attrTextPatchFx", {
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
					.deleteFrom("attr_text")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.execute();
			});

			if (value != null) {
				yield* tryDbFx(async () => {
					return kysely
						.insertInto("attr_text")
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

export type attrTextPatchFx = ReturnType<typeof attrTextPatchFx>;
