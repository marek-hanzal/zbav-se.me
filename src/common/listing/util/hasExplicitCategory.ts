export namespace hasExplicitCategory {
	export interface Where {
		categoryId?: string;
		categoryIdIn?: string[];
	}
}

export const hasExplicitCategory = (input: (hasExplicitCategory.Where | undefined)[]) => {
	return input.some((where) => {
		return Boolean(where?.categoryId) || Boolean(where?.categoryIdIn?.length);
	});
};
