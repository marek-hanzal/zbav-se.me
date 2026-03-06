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

	export const isJsonRecord = (value: unknown): value is JsonRecord => {
		return typeof value === "object" && value !== null && !Array.isArray(value);
	};

	export const withJsonSchema = (schema: z.ZodType, io: "input" | "output"): JsonSchema => {
		return toJSONSchema(schema, {
			io,
			unrepresentable: "any",
		}) as JsonSchema;
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

			const propertySchema = value as {
				description?: string;
				type?: string | string[];
			};
			const type = Array.isArray(propertySchema.type)
				? propertySchema.type.join(" | ")
				: (propertySchema.type ?? "unknown");

			return {
				name,
				required: required.includes(name),
				type,
				description: propertySchema.description,
			};
		});
	};

	export const withSchemaResourceUri = (name: string): string => {
		return `zbav://mcp/schema/${name}`;
	};
}
