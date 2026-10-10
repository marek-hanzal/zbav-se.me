export namespace toLocaleNumberFn {
	export interface Props extends Intl.NumberFormatOptions {
		locale: string;
		number?: number | null;
		empty?: string;
	}
}

export function toLocaleNumberFn({
	locale,
	number,
	empty = "-",
	...props
}: toLocaleNumberFn.Props): string {
	if (number === null || number === undefined) {
		return empty;
	}
	try {
		return number.toLocaleString(locale, props);
	} catch (e) {
		console.error("toHumanNumber", number, e);
		return number.toFixed(2);
	}
}
