import z from "zod";

export const PayloadSchema = z.object({
	userId: z.string(),
	subject: z.string(),
	scope: z.string(),
});

export type PayloadSchema = typeof PayloadSchema;

export namespace PayloadSchema {
	export type Type = z.infer<PayloadSchema>;
}
