export const CurrencyList = [
	"CZK",
	"EUR",
	"USD",
	"GBP",
	"PLN",
	"HUF",
	"CHF",
] as const;

export type CurrencyList = typeof CurrencyList;

export namespace CurrencyList {
	export type Type = (typeof CurrencyList)[number];
}
