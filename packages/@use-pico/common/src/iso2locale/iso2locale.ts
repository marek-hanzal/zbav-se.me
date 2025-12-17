import { DateTime, type DateTimeFormatOptions } from "luxon";
import { fromUtc } from "../i18n/fromUtc";
import { isString } from "../is-string/isString";
import type { DateInput } from "../type/DateInput";

export namespace iso2locale {
	export interface Props {
		locale: string;
		date?: DateInput;
		fallback?: DateInput;
		opts?: DateTimeFormatOptions;
	}
}

export const iso2locale = ({
	locale,
	date,
	fallback,
	opts,
}: iso2locale.Props): string | undefined => {
	const $date = date || fallback;
	if (!$date) {
		return undefined;
	}
	if (isString($date)) {
		return fromUtc({
			input: $date,
		}).toLocaleString(opts, {
			locale,
		});
	} else if (DateTime.isDateTime($date)) {
		return $date.toLocaleString(opts, {
			locale,
		});
	}
	return DateTime.fromJSDate($date).toLocaleString(opts, {
		locale,
	});
};
