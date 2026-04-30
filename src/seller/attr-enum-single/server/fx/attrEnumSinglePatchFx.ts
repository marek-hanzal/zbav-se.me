import { Effect } from "effect";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import type { AttrEnumSinglePatchSchema } from "../schema/AttrEnumSinglePatchSchema";

export namespace attrEnumSinglePatchFx {
	export interface Props extends AttrEnumSinglePatchSchema.Type {
		userId: string;
	}
}

export const attrEnumSinglePatchFx = Effect.fn("attrEnumSinglePatchFx")(function* ({
	userId,
	listingId,
	fieldId,
	value,
}: attrEnumSinglePatchFx.Props) {
	const logger = yield* getLoggerFx("attrEnumSinglePatchFx");
	logger.trace("attrEnumSinglePatchFx", {
		listingId,
		fieldId,
		value,
	});

	const { kysely } = yield* KyselyContextFx;

	return yield* withTransactionFx(
		Effect.gen(function* () {
			yield* tryDbFx(async () => {
				return kysely
					.deleteFrom("attr_enum_single")
					.where("listingId", "=", listingId)
					.where("fieldId", "=", fieldId)
					.where((eb) => {
						return eb.exists(
							eb
								.selectFrom("listing")
								.select("id")
								.where("id", "=", listingId)
								.where("userId", "=", userId)
								.where("status", "=", "draft"),
						);
					})
					.execute();
			});

			if (value) {
				yield* tryDbFx(async () => {
					return (
						kysely
							.insertInto("attr_enum_single")
							.columns([
								"fieldId",
								"listingId",
								"value",
							])
							/**
							 * This is a cool trik to ensure we'll insert value only to valid listing:
							 *
							 * We'll select values from request only of it matches userId and listingId, so
							 * if somebody tries to overcome this, it will return zero results, thus inserts
							 * nothing, yaaay!
							 */
							.expression((eb) => {
								return eb
									.selectFrom("listing")
									.select([
										eb.val(fieldId).as("fieldId"),
										eb.val(listingId).as("listingId"),
										eb.val(value).as("value"),
									])
									.where("id", "=", listingId)
									.where("userId", "=", userId)
									.where("status", "=", "draft");
							})
							.execute()
					);
				});
			}
		}),
	);
});

export type attrEnumSinglePatchFx = ReturnType<typeof attrEnumSinglePatchFx>;
