import { isObjectFn } from "~/object/fn/isObjectFn";

export const mapEmptyToNullFn = <TObject extends object>(object: TObject): TObject => {
	return Object.keys(object).reduce<any>((acc, key) => {
		acc[key] =
			object[key as keyof TObject] === ""
				? null
				: isObjectFn(object[key as keyof TObject])
					? mapEmptyToNullFn(object[key as keyof TObject] as object)
					: object[key as keyof TObject];
		return acc;
	}, {});
};
