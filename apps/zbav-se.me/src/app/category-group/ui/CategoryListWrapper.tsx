import { Data, Tx } from "@use-pico/client";
import type { FC } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
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
		<Data<CategoryGroupSchema.Type[], typeof categoryListQuery>
			result={categoryListQuery}
			renderSuccess={({ data }) => (
				<>
					<Tx
						label={"Select category group (title)"}
						size={"xl"}
						font={"bold"}
					/>
					<CategoryList list={data} />
				</>
			)}
		/>
	);
};
