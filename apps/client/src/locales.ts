export const defaultLocale = "cs" as const;
export const locales = [
	defaultLocale,
	"en",
];

export const availableCurrencies = [
	"CZK",
	"EUR",
	"USD",
	"GBP",
	"PLN",
	"HUF",
	"CHF",
] as const;

export const countryToCurrency = {
	cs: "CZK",
	sk: "EUR",
	pl: "PLN",
	hu: "HUF",
	de: "EUR",
	at: "EUR",
	gb: "GBP",
	us: "USD",
	unknown: "EUR",
} as const;

export type countryToCurrency = typeof countryToCurrency;

export namespace countryToCurrency {
	export type Key = keyof countryToCurrency;
}
