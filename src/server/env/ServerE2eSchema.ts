import z from "zod";

export const ServerE2eSchema = z
	.looseObject({
		SERVER_E2E: z.literal("e2e").optional().catch(undefined),
	})
	.strip();

export type ServerE2eSchema = typeof ServerE2eSchema;

export namespace ServerE2eSchema {
	export type Type = z.infer<ServerE2eSchema>;
}
