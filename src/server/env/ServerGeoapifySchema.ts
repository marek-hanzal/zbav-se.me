import z from "zod";

export const ServerGeoapifySchema = z
	.looseObject({
		SERVER_GEOAPIFY_TOKEN: z.string().min(1, "Geoapify API key is required"),
	})
	.strip();

export type ServerGeoapifySchema = typeof ServerGeoapifySchema;

export namespace ServerGeoapifySchema {
	export type Type = z.infer<ServerGeoapifySchema>;
}
