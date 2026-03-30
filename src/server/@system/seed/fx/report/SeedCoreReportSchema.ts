import { z } from "zod";

export const SeedCoreReportSchema = z
	.object({
		userId: z.string(),
		user: z.string(),
		count: z.number(),
		tables: z.record(z.string(), z.number()),
		totals: z.record(z.string(), z.number()),
	})
	.meta({
		id: "SeedCoreReport",
		description: "Report produced by the core seed run.",
	});

export type SeedCoreReportSchema = typeof SeedCoreReportSchema;

export namespace SeedCoreReportSchema {
	export type Type = z.infer<SeedCoreReportSchema>;
}
