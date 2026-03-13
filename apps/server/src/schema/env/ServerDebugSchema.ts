import z from "zod";

export const ServerDebugSchema = z
	.looseObject({
		SERVER_DEBUG_DELAY_MS: z.coerce.number().int().nonnegative().default(0),
	})
	.strip();

export type ServerDebugSchema = typeof ServerDebugSchema;

export namespace ServerDebugSchema {
	export type Type = z.infer<ServerDebugSchema>;
}
