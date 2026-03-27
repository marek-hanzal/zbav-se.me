import { z } from "@hono/zod-openapi";

export const SeedInteractionReportSchema = z.object({
	userId: z.string(),
	user: z.string(),
	count: z.number(),
	executed: z.number(),
	tables: z.record(z.string(), z.number()),
	totals: z.record(z.string(), z.number()),
});

export type SeedInteractionReportSchema = typeof SeedInteractionReportSchema;

export namespace SeedInteractionReportSchema {
	export type Type = z.infer<SeedInteractionReportSchema>;
}
