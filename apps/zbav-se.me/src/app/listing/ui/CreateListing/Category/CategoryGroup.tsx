import {
	Container,
	Data,
	Icon,
	SpinnerIcon,
	useSelection,
} from "@use-pico/client";
import type { FC } from "react";
import type { CategoryGroupSchema } from "~/app/category-group/db/CategoryGroupSchema";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/Category/CategoryGroupItem";

export const CategoryGroup: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const setCategoryGroup = useCreateListingStore(
		(store) => store.setCategoryGroup,
	);
	const selection = useSelection<CategoryGroupSchema.Type>({
		mode: "multi",
		onMulti: setCategoryGroup,
	});

	const categoryGroupQuery = withCategoryGroupListQuery().useQuery({
		sort: [
			{
				value: "sort",
				sort: "asc",
			},
		],
	});

	return (
		<Data
			result={categoryGroupQuery}
			renderLoading={() => {
				return (
					<div
						key={`category-group-wrapper-loading`}
						className="flex justify-center items-center h-full"
					>
						<Icon
							icon={SpinnerIcon}
							theme={"dark"}
							tone={"secondary"}
							size={"xl"}
						/>
					</div>
				);
			}}
			renderSuccess={({ data }) => {
				return (
					<Container
						layout={"vertical-full"}
						overflow={"vertical"}
						snap={"vertical-start"}
						gap={"md"}
					>
						{data.map((item) => {
							return (
								<CategoryGroupItem
									key={item.id}
									selection={selection}
									item={item}
								/>
							);
						})}
					</Container>
				);
			}}
		/>
	);
};
