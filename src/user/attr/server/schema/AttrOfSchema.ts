import { z } from "zod";
import { FieldTableSchema } from "~/server/database/@table/FieldTableSchema";
import type { FieldTypeEnumSchema } from "~/user/field/server/schema/FieldTypeEnumSchema";
import { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

const FieldSchema = z
	.looseObject({
		...FieldTableSchema.shape,
		options: z.array(FieldOptionSchema),
	})
	.strip();

const TextFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("text" satisfies FieldTypeEnumSchema.Type),
		required: z.boolean(),
		value: z.string().nullable(),
	})
	.strip();

const DecimalFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("decimal" satisfies FieldTypeEnumSchema.Type),
		value: z.number().nullable(),
	})
	.strip();

const NumberFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("number" satisfies FieldTypeEnumSchema.Type),
		value: z.number().nullable(),
	})
	.strip();

const YearFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("year" satisfies FieldTypeEnumSchema.Type),
		value: z.number().int().nullable(),
	})
	.strip();

const RangeFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("range" satisfies FieldTypeEnumSchema.Type),
		value: z.number().nullable(),
	})
	.strip();

const EnumSingleFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("enum-single" satisfies FieldTypeEnumSchema.Type),
		value: z.string().nullable(),
	})
	.strip();

const EnumMultiFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("enum-multi" satisfies FieldTypeEnumSchema.Type),
		value: z.array(z.string()),
	})
	.strip();

export const AttrOfSchema = z.union([
	TextFieldSchema,
	DecimalFieldSchema,
	NumberFieldSchema,
	YearFieldSchema,
	RangeFieldSchema,
	EnumSingleFieldSchema,
	EnumMultiFieldSchema,
]);

export type AttrOfSchema = typeof AttrOfSchema;

export namespace AttrOfSchema {
	export type Type = z.infer<AttrOfSchema>;
}
