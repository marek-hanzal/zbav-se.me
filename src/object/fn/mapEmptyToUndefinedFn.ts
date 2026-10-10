import { isObjectFn } from "~/object/fn/isObjectFn";

export const mapEmptyToUndefinedFn = <T extends Record<string, unknown>>(object: T): T => {
	return Object.keys(object).reduce(
		(acc, key) => {
			const value = object[key];

			if (value === "") {
				(acc as Record<string, unknown>)[key] = undefined;
			} else if (isObjectFn(value)) {
				(acc as Record<string, unknown>)[key] = mapEmptyToUndefinedFn(
					value as Record<string, unknown>,
				);
			} else {
				(acc as Record<string, unknown>)[key] = value;
			}

			return acc;
		},
		{
			...object,
		} as T,
	);
};
