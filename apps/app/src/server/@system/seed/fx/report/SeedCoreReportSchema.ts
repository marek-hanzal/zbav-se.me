import { z } from "@hono/zod-openapi";

export const SeedCoreReportSchema = z.object({
	userId: z.string(),
	user: z.string(),
	count: z.number(),
	tables: z.record(z.string(), z.number()),
	totals: z.record(z.string(), z.number()),
});

export type SeedCoreReportSchema = typeof SeedCoreReportSchema;

export namespace SeedCoreReportSchema {
	export type Type = z.infer<SeedCoreReportSchema>;
}
