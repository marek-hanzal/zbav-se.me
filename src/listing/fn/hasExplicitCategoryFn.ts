export namespace hasExplicitCategoryFn {
	export interface Where {
		categoryId?: string;
		categoryIdIn?: string[];
	}
}

export const hasExplicitCategoryFn = (input: (hasExplicitCategoryFn.Where | undefined)[]) => {
	return input.some((where) => {
		return Boolean(where?.categoryId) || Boolean(where?.categoryIdIn?.length);
	});
};
