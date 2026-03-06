import { z } from "@hono/zod-openapi";

export const CategoryMcpOutputSchema = z
	.object({
		id: z.string().describe("Stable category id used in draft and listing write flows."),
		group: z.string().describe("High-level category group label shown to sellers and buyers."),
		category: z
			.string()
			.describe("Concrete category label that should be presented to humans."),
		slug: z
			.string()
			.describe("Stable category slug useful for machine-readable references and matching."),
		sort: z.number().describe("Category sort position inside its group and locale."),
		locale: z.string().describe("Locale of the category label, for example cs or en."),
	})
	.describe(
		"One category suggestion or selection option returned by the session category collection MCP tool.",
	);

export type CategoryMcpOutputSchema = typeof CategoryMcpOutputSchema;

export namespace CategoryMcpOutputSchema {
	export type Type = z.infer<CategoryMcpOutputSchema>;
}
