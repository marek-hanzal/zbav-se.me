import z from "zod";

export const ServerAxiomSchema = z.object({
	SERVER_AXIOM_TOKEN: z.string().min(1, "Axiom API token is required"),
	SERVER_AXIOM_DATASET: z.string().min(1, "Axiom dataset name is required"),
});

export type ServerAxiomSchema = typeof ServerAxiomSchema;

export namespace ServerAxiomSchema {
	export type Type = z.infer<ServerAxiomSchema>;
}
