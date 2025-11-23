import { z } from "@hono/zod-openapi";

export const CurrencyListEnumSchema = z
	.enum([
		"CZK",
		"EUR",
		"USD",
		"GBP",
		"PLN",
		"HUF",
		"CHF",
	])
	.openapi("CurrencyListEnum", {
		description: "List of available currencies",
	});

export type CurrencyListEnumSchema = typeof CurrencyListEnumSchema;

export namespace CurrencyListEnumSchema {
	export type Type = z.infer<CurrencyListEnumSchema>;
}
