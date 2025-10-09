import { Data } from "@use-pico/client";
import type { FC } from "react";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { CategoryList } from "~/app/category-group/ui/CategoryList";

export namespace CategoryListWrapper {
	export interface Props extends Omit<CategoryList.Props, "list"> {}
}

export const CategoryListWrapper: FC<CategoryListWrapper.Props> = () => {
	const categoryListQuery = withCategoryGroupListQuery().useQuery({
		sort: [
			{
				value: "sort",
				sort: "asc",
			},
		],
	});

	return (
		<Data
			result={categoryListQuery}
			renderSuccess={({ data }) => <CategoryList list={data} />}
		/>
	);
};
