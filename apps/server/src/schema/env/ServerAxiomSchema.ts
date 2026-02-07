import z from "zod";

export const ServerAxiomSchema = z.object({
	SERVER_AXIOM: z.string().min(1, "Axiom API token is required"),
});
