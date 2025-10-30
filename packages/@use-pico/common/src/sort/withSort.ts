import type { OrderSchema } from "../source/OrderSchema";
import type { StateType } from "../type/StateType";

export namespace withSort {
	export interface SortItem {
		sort?: OrderSchema.Type;
		value: string;
	}

	export interface Props {
		state: StateType<SortItem[] | null | undefined>;
		value: string;
		by?: OrderSchema.Type;
	}
}

export const withSort = ({ value, state, by }: withSort.Props) => {
	const currentItems = state.value ?? [];

	// Find the index of the current column in the sort array
	const existingIndex = currentItems.findIndex(
		(item) => item.value === value,
	);

	// If no sort direction specified, remove the column from its current position
	if (!by) {
		if (existingIndex === -1) {
			return; // Column not found, nothing to remove
		}

		const newItems = [
			...currentItems,
		];
		newItems.splice(existingIndex, 1);
		state.set(newItems);
		return newItems;
	}

	// Create the new sort item
	const newSortItem = {
		sort: by,
		value: value,
	};

	// If column already exists, update it in-place
	if (existingIndex !== -1) {
		const newItems = [
			...currentItems,
		];
		newItems[existingIndex] = newSortItem;
		state.set(newItems);
		return newItems;
	}

	const result = [
		...currentItems,
		newSortItem,
	];

	// If column doesn't exist, add it to the end
	state.set(result);

	return result;
};
