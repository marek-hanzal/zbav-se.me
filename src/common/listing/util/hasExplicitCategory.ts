export namespace hasExplicitCategory {
	export interface Filter {
		categoryId?: string;
		categoryIdIn?: string[];
	}
}

export const hasExplicitCategory = (input: (hasExplicitCategory.Filter | undefined)[]) => {
	return input.some((filter) => {
		return Boolean(filter?.categoryId) || Boolean(filter?.categoryIdIn?.length);
	});
};
