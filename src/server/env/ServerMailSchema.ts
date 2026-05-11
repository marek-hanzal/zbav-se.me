import { z } from "zod";

export const ServerMailSchema = z
	.looseObject({
		SERVER_RESEND: z.string().min(1, "Missing Resend API key"),
		SERVER_RESEND_FROM: z.string().min(1, "Missing 'from' configuration for resend"),
	})
	.strip();

export type ServerMailSchema = typeof ServerMailSchema;

export namespace ServerMailSchema {
	export type Type = z.infer<ServerMailSchema>;
}
