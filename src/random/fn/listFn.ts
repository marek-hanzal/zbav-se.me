import { rangedomFn } from "~/random/fn/rangedomFn";

export const listFn = <T>(list: T[]): T => {
	if (list.length === 0) {
		throw new Error("List is empty");
	}

	const item = list[rangedomFn(0, list.length - 1)];

	if (item === undefined) {
		throw new Error("Item is undefined");
	}

	return item;
};
