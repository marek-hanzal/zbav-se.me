import { z } from "zod";

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
	.meta({
		id: "CurrencyEnum",
		description: "List of available currencies",
	});

export type CurrencyEnumSchema = typeof CurrencyEnumSchema;

export namespace CurrencyEnumSchema {
	export type Type = z.infer<CurrencyEnumSchema>;
}
