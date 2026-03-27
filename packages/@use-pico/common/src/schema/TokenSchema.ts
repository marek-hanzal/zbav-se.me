import { z } from "zod";

export const TokenSchema = z
	.looseObject({
		tokens: z.array(z.string().min(1)),
	})
	.strip()
	.meta({
		id: "Token",
		description: "Token collection payload",
	});

export type TokenSchema = typeof TokenSchema;

export namespace TokenSchema {
	export type Type = z.infer<TokenSchema>;
}
