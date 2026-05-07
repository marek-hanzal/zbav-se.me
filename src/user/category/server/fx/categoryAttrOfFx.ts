import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { CategoryAttrOfSchema } from "../schema/CategoryAttrOfSchema";

export namespace categoryAttrOfFx {
	export interface Props {
		categoryId: string;
	}
}

export const categoryAttrOfFx = Effect.fn("categoryAttrOfFx")(function* ({
	categoryId,
}: categoryAttrOfFx.Props) {
	const logger = yield* getLoggerFx("categoryAttrOfFx");
	logger.trace("categoryAttrOfFx", {
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
				sql<number | null>`f.min::float8`.as("min"),
				sql<number | null>`f.max::float8`.as("max"),
				sql<number | null>`f.step::float8`.as("step"),
				"cf.kind",
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
			.$castTo<CategoryAttrOfSchema.Type>()
			.execute();
	});
});

export type categoryAttrOfFx = ReturnType<typeof categoryAttrOfFx>;
