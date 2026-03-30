import { z } from "zod";

export const SeedInteractionReportSchema = z
	.object({
		userId: z.string(),
		user: z.string(),
		count: z.number(),
		executed: z.number(),
		tables: z.record(z.string(), z.number()),
		totals: z.record(z.string(), z.number()),
	})
	.meta({
		id: "SeedInteractionReport",
		description: "Report produced by the interaction seed run.",
	});

export type SeedInteractionReportSchema = typeof SeedInteractionReportSchema;

export namespace SeedInteractionReportSchema {
	export type Type = z.infer<SeedInteractionReportSchema>;
}
