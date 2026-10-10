import { z } from "zod";

export const SeedRunConfigSchema = z
	.object({
		seedId: z.string().min(1),
		count: z.coerce.number().int().positive(),
		userEmail: z.email(),
	})
	.meta({
		id: "SeedRunConfig",
		description: "Validated interactive seed run configuration.",
	});

export type SeedRunConfigSchema = typeof SeedRunConfigSchema;

export namespace SeedRunConfigSchema {
	export type Type = z.infer<SeedRunConfigSchema>;
}
