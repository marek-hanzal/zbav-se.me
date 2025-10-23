import { z } from "@hono/zod-openapi";
import { CurrencyList } from "@zbav-se.me/common";

export const CurrencyListSchema = z.enum(CurrencyList).openapi("CurrencyList", {
	description: "Currency code (ISO 4217)",
	example: "USD",
});

export type CurrencyListSchema = typeof CurrencyListSchema;

export namespace CurrencyListSchema {
	export type Type = z.infer<typeof CurrencyListSchema>;
}
