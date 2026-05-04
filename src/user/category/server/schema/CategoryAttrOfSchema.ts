import { z } from "zod";
import { FieldTableSchema } from "~/server/database/@table/FieldTableSchema";
import type { FieldTypeEnumSchema } from "~/user/field/server/schema/FieldTypeEnumSchema";
import { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

const FieldSchema = z
	.looseObject({
		...FieldTableSchema.shape,
	})
	.strip();

const TextFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("text" satisfies FieldTypeEnumSchema.Type),
	})
	.omit({
		step: true,
	})
	.strip();

const DecimalFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("decimal" satisfies FieldTypeEnumSchema.Type),
	})
	.strip();

const NumberFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("number" satisfies FieldTypeEnumSchema.Type),
	})
	.strip();

const YearFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("year" satisfies FieldTypeEnumSchema.Type),
	})
	.omit({
		step: true,
	})
	.strip();

const RangeFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("range" satisfies FieldTypeEnumSchema.Type),
	})
	.strip();

const EnumSingleFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("enum-single" satisfies FieldTypeEnumSchema.Type),
		options: z.array(FieldOptionSchema),
	})
	.omit({
		step: true,
	})
	.strip();

const EnumMultiFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("enum-multi" satisfies FieldTypeEnumSchema.Type),
		options: z.array(FieldOptionSchema),
	})
	.omit({
		step: true,
	})
	.strip();

export const CategoryAttrOfSchema = z.union([
	TextFieldSchema,
	DecimalFieldSchema,
	NumberFieldSchema,
	YearFieldSchema,
	RangeFieldSchema,
	EnumSingleFieldSchema,
	EnumMultiFieldSchema,
]);

export type CategoryAttrOfSchema = typeof CategoryAttrOfSchema;

export namespace CategoryAttrOfSchema {
	export type Type = z.infer<CategoryAttrOfSchema>;
}
