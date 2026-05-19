import { z } from "zod";

export const ServerMailSchema = z
	.looseObject({
		SERVER_SMTP_HOST: z.string().min(1, "SMTP host is required"),
		SERVER_SMTP_PORT: z.coerce.number().int().positive("SMTP port must be positive"),
		SERVER_SMTP_USERNAME: z.string().min(1, "SMTP username is required"),
		SERVER_SMTP_PASSWORD: z.string().min(1, "SMTP password is required"),
		SERVER_SMTP_FROM: z.string().min(1, "SMTP from address is required"),
	})
	.strip();

export type ServerMailSchema = typeof ServerMailSchema;

export namespace ServerMailSchema {
	export type Type = z.infer<ServerMailSchema>;
}
