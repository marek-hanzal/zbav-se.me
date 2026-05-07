import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { DraftAttrOfSchema } from "../schema/DraftAttrOfSchema";

export namespace draftAttrOfFx {
	export interface Props {
		draftId: string;
		categoryId: string;
	}
}

export const draftAttrOfFx = Effect.fn("draftAttrOfFx")(function* ({
	draftId,
	categoryId,
}: draftAttrOfFx.Props) {
	const logger = yield* getLoggerFx("draftAttrOfFx");
	logger.trace("draftAttrOfFx", {
		draftId,
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
				(eb) => {
					return eb
						.case()
						.when("f.type", "=", "enum-single")
						.then(
							eb
								.selectFrom("draft_attr_enum_single as aes")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("aes.value")})`.as("value"),
								])
								.where("aes.draftId", "=", draftId)
								.whereRef("aes.fieldId", "=", "cf.fieldId")
								.$castTo<string>(),
						)
						.when("f.type", "=", "enum-multi")
						.then(
							eb
								.selectFrom("draft_attr_enum_multi as aem")
								.select((eb) => {
									return eb.fn
										.coalesce(
											sql`jsonb_agg(to_jsonb(${eb.ref("aem.value")}) order by ${eb.ref("aem.value")})`,
											sql`'[]'::jsonb`,
										)
										.as("value");
								})
								.where("aem.draftId", "=", draftId)
								.whereRef("aem.fieldId", "=", "cf.fieldId")
								.$castTo<string[]>(),
						)
						.when("f.type", "=", "number")
						.then(
							eb
								.selectFrom("draft_attr_number as an")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("an.value")})`.as("value"),
								])
								.where("an.draftId", "=", draftId)
								.whereRef("an.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "year")
						.then(
							eb
								.selectFrom("draft_attr_number as an")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("an.value")})`.as("value"),
								])
								.where("an.draftId", "=", draftId)
								.whereRef("an.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "decimal")
						.then(
							eb
								.selectFrom("draft_attr_decimal as ad")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("ad.value")})`.as("value"),
								])
								.where("ad.draftId", "=", draftId)
								.whereRef("ad.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "range")
						.then(
							eb
								.selectFrom("draft_attr_decimal as ad")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("ad.value")})`.as("value"),
								])
								.where("ad.draftId", "=", draftId)
								.whereRef("ad.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "text")
						.then(
							eb
								.selectFrom("draft_attr_text as at")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("at.value")})`.as("value"),
								])
								.where("at.draftId", "=", draftId)
								.whereRef("at.fieldId", "=", "cf.fieldId")
								.$castTo<string>(),
						)
						.else(null)
						.end()
						.as("value");
				},
			])
			.where("cf.categoryId", "=", categoryId)
			.orderBy("cf.sort", "asc")
			.$castTo<DraftAttrOfSchema.Type>()
			.execute();
	});
});

export type draftAttrOfFx = ReturnType<typeof draftAttrOfFx>;
