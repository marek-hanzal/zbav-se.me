import { z } from "zod";
import { FieldTypeEnumSchema } from "~/user/field/server/schema/FieldTypeEnumSchema";

const FieldSchema = z
	.looseObject({
		name: z.string().meta({
			description: "Name of the field",
		}),
		type: FieldTypeEnumSchema.meta({
			description: "Type of the field",
		}),
	})
	.strip();

const TextFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("text" satisfies FieldTypeEnumSchema.Type),
		value: z.string().optional(),
	})
	.strip();

const DecimalFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("decimal" satisfies FieldTypeEnumSchema.Type),
		value: z.number().optional(),
		min: z.number().optional(),
		max: z.number().optional(),
	})
	.strip();

const NumberFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("number" satisfies FieldTypeEnumSchema.Type),
		value: z.number().optional(),
		min: z.number().optional(),
		max: z.number().optional(),
	})
	.strip();

const YearFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("year" satisfies FieldTypeEnumSchema.Type),
		value: z.number().int().optional(),
		min: z.number().int().optional(),
		max: z.number().int().optional(),
	})
	.strip();

const RangeFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("range" satisfies FieldTypeEnumSchema.Type),
		value: z.number().optional(),
		min: z.number().optional(),
		max: z.number().optional(),
	})
	.strip();

const EnumSingleFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("enum-single" satisfies FieldTypeEnumSchema.Type),
		value: z.array(z.string().min(1)).optional(),
	})
	.strip();

const EnumMultiFieldSchema = z
	.looseObject({
		...FieldSchema.shape,
		type: z.literal("enum-multi" satisfies FieldTypeEnumSchema.Type),
		value: z.array(z.string().min(1)).optional(),
	})
	.strip();

export const AttrWhereSchema = z.union([
	TextFieldSchema,
	DecimalFieldSchema,
	NumberFieldSchema,
	YearFieldSchema,
	RangeFieldSchema,
	EnumSingleFieldSchema,
	EnumMultiFieldSchema,
]);

export type AttrWhereSchema = typeof AttrWhereSchema;

export namespace AttrWhereSchema {
	export type Type = z.infer<AttrWhereSchema>;
}
