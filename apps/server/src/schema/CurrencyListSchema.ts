import { z } from "@hono/zod-openapi";

export const CurrencyListSchema = z
	.enum([
		"CZK",
		"EUR",
		"USD",
		"GBP",
		"PLN",
		"HUF",
		"CHF",
	])
	.openapi("CurrencyList", {
		description: "List of available currencies",
	});

export type CurrencyListSchema = typeof CurrencyListSchema;

export namespace CurrencyListSchema {
	export type Type = z.infer<CurrencyListSchema>;
}
