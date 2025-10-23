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
