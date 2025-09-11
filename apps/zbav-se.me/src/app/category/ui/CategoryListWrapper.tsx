import { Data } from "@use-pico/client";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { CategoryList } from "~/app/category/ui/CategoryList";

export namespace CategoryListWrapper {
	export interface Props extends Omit<CategoryList.Props, "list"> {
		categoryGroupId: string;
	}
}

export const CategoryListWrapper: FC<CategoryListWrapper.Props> = ({
	categoryGroupId,
	...props
}) => {
	const categoryListQuery = withCategoryListQuery().useQuery({
		where: {
			categoryGroupId,
		},
		sort: [
			{
				value: "sort",
				sort: "asc",
			},
		],
	});

	return (
		<Data<CategorySchema.Type[], typeof categoryListQuery>
			result={categoryListQuery}
			renderSuccess={({ data }) => (
				<CategoryList
					{...props}
					list={data}
				/>
			)}
		/>
	);
};
