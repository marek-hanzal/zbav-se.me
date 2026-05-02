import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { AttrOfSchema } from "../schema/AttrOfSchema";

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
								.selectFrom("attr_enum_single as aes")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("aes.value")})`.as("value"),
								])
								.where("aes.listingId", "=", listingId)
								.whereRef("aes.fieldId", "=", "cf.fieldId")
								.$castTo<string>(),
						)
						.when("f.type", "=", "enum-multi")
						.then(
							eb
								.selectFrom("attr_enum_multi as aem")
								.select((eb) => {
									return eb.fn
										.coalesce(
											sql`jsonb_agg(to_jsonb(${eb.ref("aem.value")}) order by ${eb.ref("aem.value")})`,
											sql`'[]'::jsonb`,
										)
										.as("value");
								})
								.where("aem.listingId", "=", listingId)
								.whereRef("aem.fieldId", "=", "cf.fieldId")
								.$castTo<string[]>(),
						)
						.when("f.type", "=", "number")
						.then(
							eb
								.selectFrom("attr_number as an")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("an.value")})`.as("value"),
								])
								.where("an.listingId", "=", listingId)
								.whereRef("an.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "year")
						.then(
							eb
								.selectFrom("attr_number as an")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("an.value")})`.as("value"),
								])
								.where("an.listingId", "=", listingId)
								.whereRef("an.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "decimal")
						.then(
							eb
								.selectFrom("attr_decimal as ad")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("ad.value")})`.as("value"),
								])
								.where("ad.listingId", "=", listingId)
								.whereRef("ad.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "range")
						.then(
							eb
								.selectFrom("attr_decimal as ad")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("ad.value")})`.as("value"),
								])
								.where("ad.listingId", "=", listingId)
								.whereRef("ad.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "text")
						.then(
							eb
								.selectFrom("attr_text as at")
								.select([
									(eb) => sql`to_jsonb(${eb.ref("at.value")})`.as("value"),
								])
								.where("at.listingId", "=", listingId)
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
			.$castTo<AttrOfSchema.Type>()
			.execute();
	});
});

export type attrOfFx = ReturnType<typeof attrOfFx>;
