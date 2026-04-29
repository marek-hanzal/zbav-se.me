import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

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
			.$castTo<
				| {
						name: string;
						type: "text";
						options: FieldOptionSchema.Type[];
						required: true;
						value: string;
				  }
				| {
						name: string;
						type: "text";
						options: FieldOptionSchema.Type[];
						required: false;
						value: string | null;
				  }
				//
				| {
						name: string;
						type: "decimal";
						options: FieldOptionSchema.Type[];
						required: true;
						value: number;
				  }
				| {
						name: string;
						type: "decimal";
						options: FieldOptionSchema.Type[];
						required: false;
						value: number | null;
				  }
				//
				| {
						name: string;
						type: "number";
						options: FieldOptionSchema.Type[];
						required: true;
						value: number;
				  }
				| {
						name: string;
						type: "number";
						options: FieldOptionSchema.Type[];
						required: false;
						value: number | null;
				  }
				//
				| {
						name: string;
						type: "enum-single";
						options: FieldOptionSchema.Type[];
						required: true;
						value: string;
				  }
				| {
						name: string;
						type: "enum-single";
						options: FieldOptionSchema.Type[];
						required: false;
						value: string | null;
				  }
				//
				| {
						name: string;
						type: "enum-multi";
						options: FieldOptionSchema.Type[];
						required: true;
						value: [
							string,
							...string[],
						];
				  }
				| {
						name: string;
						type: "enum-multi";
						options: FieldOptionSchema.Type[];
						required: false;
						value: string[];
				  }
			>()
			.execute();
	});
});

export type attrOfFx = ReturnType<typeof attrOfFx>;
