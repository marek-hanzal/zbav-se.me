import {
	Container,
	Data,
	Icon,
	SpinnerIcon,
	useSelection,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, useRef } from "react";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/CategoryGroupItem";
import { Fade } from "~/app/ui/fade/Fade";

export const CategoryGroupWrapper: FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const useCreateListingStore = useCreateListingContext();
	const setCategoryGroup = useCreateListingStore(
		(store) => store.setCategoryGroup,
	);
	const selection = useSelection<CategoryGroup>({
		mode: "single",
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
					<div className="relative">
						<Fade scrollableRef={containerRef} />

						<Container
							ref={containerRef}
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
					</div>
				);
			}}
		/>
	);
};
