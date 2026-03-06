import { toJSONSchema, type z } from "zod";

export namespace McpSchema {
	export type JsonPrimitive = boolean | null | number | string;
	export type JsonValue =
		| JsonPrimitive
		| JsonValue[]
		| {
				[key: string]: JsonValue;
		  };
	export type JsonRecord = Record<string, JsonValue>;
	export type JsonSchema = {
		description?: string;
		items?: JsonSchema;
		properties?: Record<string, JsonSchema>;
		required?: string[];
		type?: string | string[];
		[key: string]: unknown;
	};

	export interface SummaryItem {
		description?: string;
		name: string;
		required: boolean;
		type: string;
	}

	type JsonSchemaWithVariants = JsonSchema & {
		anyOf?: JsonSchema[];
		oneOf?: JsonSchema[];
	};

	export const isJsonRecord = (value: unknown): value is JsonRecord => {
		return typeof value === "object" && value !== null && !Array.isArray(value);
	};

	export const withJsonSchema = (schema: z.ZodType, io: "input" | "output"): JsonSchema => {
		return toJSONSchema(schema, {
			io,
			unrepresentable: "any",
		}) as JsonSchema;
	};

	const withType = (schema: JsonSchemaWithVariants): string => {
		if (typeof schema.type === "string") {
			if (schema.type === "array" && schema.items) {
				return `${withType(schema.items)}[]`;
			}

			return schema.type;
		}

		if (Array.isArray(schema.type)) {
			return schema.type.join(" | ");
		}

		const variants = schema.anyOf ?? schema.oneOf;
		if (variants) {
			const types = variants
				.map((item) => withType(item))
				.filter((value, index, all) => all.indexOf(value) === index);

			return types.length > 0 ? types.join(" | ") : "unknown";
		}

		if (schema.properties) {
			return "object";
		}

		return "unknown";
	};

	export const withSummary = (schema: JsonSchema): SummaryItem[] => {
		if (schema.type === "array" && schema.items) {
			return withSummary(schema.items);
		}

		if (schema.type !== "object" || !schema.properties) {
			return [];
		}

		const required = Array.isArray(schema.required) ? schema.required : [];

		return Object.entries(schema.properties).map(([name, value]) => {
			if (!value || typeof value !== "object" || Array.isArray(value)) {
				return {
					name,
					required: required.includes(name),
					type: "unknown",
				};
			}

			const propertySchema = value as JsonSchemaWithVariants;

			return {
				name,
				required: required.includes(name),
				type: withType(propertySchema),
				description: propertySchema.description,
			};
		});
	};

	export const withSchemaResourceUri = (name: string): string => {
		return `zbav://mcp/schema/${name}`;
	};

	export const withGuideResourceUri = (name: string): string => {
		return `zbav://mcp/guide/${name}`;
	};

	export const withProfileResourceUri = (name: string): string => {
		return `zbav://mcp/profile/${name}`;
	};

	export const withEntityResourceUri = (name: string): string => {
		return `zbav://mcp/entity/${name}`;
	};

	export const withEnumResourceUri = (name: string): string => {
		return `zbav://mcp/schema/enum/${name}`;
	};

	export const withFieldResourceUri = (name: string): string => {
		return `zbav://mcp/field/${name}`;
	};
}
