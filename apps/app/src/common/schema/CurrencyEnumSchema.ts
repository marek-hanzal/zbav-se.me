import { z } from "@hono/zod-openapi";

export const CurrencyEnumSchema = z
	.enum([
		"CZK",
		"EUR",
		"USD",
		"GBP",
		"PLN",
		"HUF",
		"CHF",
	])
	.openapi("CurrencyEnum", {
		description: "List of available currencies",
	});

export type CurrencyEnumSchema = typeof CurrencyEnumSchema;

export namespace CurrencyEnumSchema {
	export type Type = z.infer<CurrencyEnumSchema>;
}
