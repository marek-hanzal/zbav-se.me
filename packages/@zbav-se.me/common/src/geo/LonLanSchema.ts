import z from "zod";

export const LonLanSchema = z.object({
	lon: z.number(),
	lat: z.number(),
});

export type LonLanSchema = typeof LonLanSchema;

export namespace LonLanSchema {
	export type Type = z.infer<LonLanSchema>;
}
