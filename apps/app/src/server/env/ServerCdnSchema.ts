import z from "zod";

export const ServerCdnSchema = z
	.looseObject({
		SERVER_CONTENT_CDN: z.url(),
	})
	.strip();

export type ServerCdnSchema = typeof ServerCdnSchema;

export namespace ServerCdnSchema {
	export type Type = z.infer<ServerCdnSchema>;
}
