import { Effect } from "effect";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace attrOfFx {
	export interface Props {
		listingId: string;
		categoryId: string;
	}
}

export const attrOfFx = Effect.fn("attrOfFx")(function* ({
	listingId,
	categoryId,
}: attrOfFx.Props) {
	const logger = yield* getLoggerFx("attrOfFx");
	logger.trace("attrOfFx", {
		listingId,
		categoryId,
	});

	const { kysely } = yield* KyselyContextFx;

	return yield* Effect.promise(async () => {
		return kysely
			.selectFrom("category_field as cf")
			.innerJoin("field as f", "f.name", "cf.fieldId")
			.select([
				"f.name",
				"f.type",
				(eb) => {
					return eb.fn.coalesce("cf.required", eb.ref("f.required")).as("required");
				},
				(eb) => {
					return jsonArrayFrom(
						eb
							.selectFrom("field_option as fo")
							.select([
								"fo.fieldId",
								"fo.value",
								"fo.sort",
							])
							.whereRef("fo.fieldId", "=", "cf.fieldId")
							.orderBy("fo.sort", "asc"),
					).as("options");
				},
			])
			.where("cf.categoryId", "=", categoryId)
			.orderBy("cf.sort", "asc")
			.execute();
	});
});

export type attrOfFx = ReturnType<typeof attrOfFx>;
