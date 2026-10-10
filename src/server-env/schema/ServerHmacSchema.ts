import z from "zod";

export const ServerHmacSchema = z
	.looseObject({
		SERVER_HMAC_SECRET: z.string().min(1, "HMAC secret is required"),
	})
	.strip();

export type ServerHmacSchema = typeof ServerHmacSchema;

export namespace ServerHmacSchema {
	export type Type = z.infer<ServerHmacSchema>;
}
