import { z } from "zod";

export const BundleActiveSchema = z
	.looseObject({
		bundle: z.string().min(1),
	})
	.strip()
	.meta({
		id: "BundleActive",
		description: "Query data for checking whether a user has an active bundle.",
	});

export type BundleActiveSchema = typeof BundleActiveSchema;

export namespace BundleActiveSchema {
	export type Type = z.infer<BundleActiveSchema>;
}
