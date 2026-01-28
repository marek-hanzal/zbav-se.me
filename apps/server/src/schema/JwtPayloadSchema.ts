import z from "zod";

export const JwtPayloadSchema = z.object({
	userId: z.string(),
	subject: z.string(),
	scope: z.string(),
});

export type JwtPayloadSchema = typeof JwtPayloadSchema;

export namespace JwtPayloadSchema {
	export type Type = z.infer<JwtPayloadSchema>;
}
