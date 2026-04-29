import { z } from "zod";
import type { FieldTypeEnumSchema } from "~/user/field/server/schema/FieldTypeEnumSchema";
import { FieldOptionSchema } from "~/user/field-option/server/schema/FieldOptionSchema";

const FieldSchema = z.object({
	name: z.string(),
	options: z.array(FieldOptionSchema),
});

const TextFieldSchema = z.discriminatedUnion("required", [
	z.object({
		...FieldSchema.shape,
		type: z.literal("text" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(true),
		value: z.string(),
	}),
	z.object({
		...FieldSchema.shape,
		type: z.literal("text" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(false),
		value: z.string().nullable(),
	}),
]);

const DecimalFieldSchema = z.discriminatedUnion("required", [
	z.object({
		...FieldSchema.shape,
		type: z.literal("decimal" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(true),
		value: z.number(),
	}),
	z.object({
		...FieldSchema.shape,
		type: z.literal("decimal" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(false),
		value: z.number().nullable(),
	}),
]);

const NumberFieldSchema = z.discriminatedUnion("required", [
	z.object({
		...FieldSchema.shape,
		type: z.literal("number" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(true),
		value: z.number(),
	}),
	z.object({
		...FieldSchema.shape,
		type: z.literal("number" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(false),
		value: z.number().nullable(),
	}),
]);

const EnumSingleFieldSchema = z.discriminatedUnion("required", [
	z.object({
		...FieldSchema.shape,
		type: z.literal("enum-single" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(true),
		value: z.string(),
	}),
	z.object({
		...FieldSchema.shape,
		type: z.literal("enum-single" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(false),
		value: z.string().nullable(),
	}),
]);

const EnumMultiFieldSchema = z.discriminatedUnion("required", [
	z.object({
		...FieldSchema.shape,
		type: z.literal("enum-multi" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(true),
		value: z.array(z.string()).nonempty(),
	}),
	z.object({
		...FieldSchema.shape,
		type: z.literal("enum-multi" satisfies FieldTypeEnumSchema.Type),
		required: z.literal(false),
		value: z.array(z.string()),
	}),
]);

export const AttrOfSchema = z.union([
	TextFieldSchema,
	DecimalFieldSchema,
	NumberFieldSchema,
	EnumSingleFieldSchema,
	EnumMultiFieldSchema,
]);

export type AttrOfSchema = typeof AttrOfSchema;

export namespace AttrOfSchema {
	export type Type = z.infer<AttrOfSchema>;
}
