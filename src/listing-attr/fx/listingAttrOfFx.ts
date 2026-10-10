import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";
import type { ListingAttrOfSchema } from "~/listing-attr/schema/ListingAttrOfSchema";
import { getLoggerFx } from "~/log/fx/getLoggerFx";

export namespace listingAttrOfFx {
	export interface Props {
		listingId: string;
		categoryId: string;
		nonEmpty?: boolean;
	}
}

export const listingAttrOfFx = Effect.fn("listingAttrOfFx")(function* ({
	listingId,
	categoryId,
	nonEmpty = true,
}: listingAttrOfFx.Props) {
	const logger = yield* getLoggerFx("listingAttrOfFx");
	logger.trace("listingAttrOfFx", {
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
				(ebFn) => {
					return jsonArrayFrom(
						ebFn
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
				(ebFn) => {
					return ebFn
						.case()
						.when("f.type", "=", "enum-single")
						.then(
							ebFn
								.selectFrom("listing_attr_enum_single as aes")
								.select([
									(ebFn) => sql`to_jsonb(${ebFn.ref("aes.value")})`.as("value"),
								])
								.where("aes.listingId", "=", listingId)
								.whereRef("aes.fieldId", "=", "cf.fieldId")
								.$castTo<string>(),
						)
						.when("f.type", "=", "enum-multi")
						.then(
							ebFn
								.selectFrom("listing_attr_enum_multi as aem")
								.select((ebFn) => {
									return ebFn.fn
										.coalesce(
											sql`jsonb_agg(to_jsonb(${ebFn.ref("aem.value")}) order by ${ebFn.ref("aem.value")})`,
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
							ebFn
								.selectFrom("listing_attr_number as an")
								.select([
									(ebFn) => sql`to_jsonb(${ebFn.ref("an.value")})`.as("value"),
								])
								.where("an.listingId", "=", listingId)
								.whereRef("an.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "year")
						.then(
							ebFn
								.selectFrom("listing_attr_number as an")
								.select([
									(ebFn) => sql`to_jsonb(${ebFn.ref("an.value")})`.as("value"),
								])
								.where("an.listingId", "=", listingId)
								.whereRef("an.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "decimal")
						.then(
							ebFn
								.selectFrom("listing_attr_decimal as ad")
								.select([
									(ebFn) => sql`to_jsonb(${ebFn.ref("ad.value")})`.as("value"),
								])
								.where("ad.listingId", "=", listingId)
								.whereRef("ad.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "range")
						.then(
							ebFn
								.selectFrom("listing_attr_decimal as ad")
								.select([
									(ebFn) => sql`to_jsonb(${ebFn.ref("ad.value")})`.as("value"),
								])
								.where("ad.listingId", "=", listingId)
								.whereRef("ad.fieldId", "=", "cf.fieldId")
								.$castTo<number>(),
						)
						.when("f.type", "=", "text")
						.then(
							ebFn
								.selectFrom("listing_attr_text as at")
								.select([
									(ebFn) => sql`to_jsonb(${ebFn.ref("at.value")})`.as("value"),
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
			.$castTo<ListingAttrOfSchema.Type>()
			.execute()
			.then((items) => {
				if (nonEmpty !== true) {
					return items;
				}

				return items
					.filter((attr) => {
						return attr.value !== null && attr.value !== undefined;
					})
					.filter((attr) => {
						if (Array.isArray(attr.value) && !attr.value.length) {
							return false;
						}

						return true;
					});
			});
	});
});

export type listingAttrOfFx = ReturnType<typeof listingAttrOfFx>;
