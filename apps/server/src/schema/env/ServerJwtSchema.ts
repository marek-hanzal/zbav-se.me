import z from "zod";

export const ServerJwtSchema = z
	.looseObject({
		SERVER_JWT_SECRET: z.string().min(1, "JWT secret is required"),
	})
	.strip();

export type ServerJwtSchema = typeof ServerJwtSchema;

export namespace ServerJwtSchema {
	export type Type = z.infer<ServerJwtSchema>;
}
