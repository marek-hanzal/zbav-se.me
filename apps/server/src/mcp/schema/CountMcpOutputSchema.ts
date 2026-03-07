import { z } from "@hono/zod-openapi";

export const CountMcpOutputSchema = z
	.object({
		filter: z
			.number()
			.describe("Count for the public filter query semantics exposed through MCP."),
		total: z.number().describe("Total count before public filters are applied."),
		isEmpty: z.boolean().describe("True when the total count is zero."),
		isFilterEmpty: z
			.boolean()
			.describe("True when the filtered count is zero while some total data still exists."),
	})
	.describe("Generic count output returned by seller count tools.");

export type CountMcpOutputSchema = typeof CountMcpOutputSchema;

export namespace CountMcpOutputSchema {
	export type Type = z.infer<CountMcpOutputSchema>;
}
