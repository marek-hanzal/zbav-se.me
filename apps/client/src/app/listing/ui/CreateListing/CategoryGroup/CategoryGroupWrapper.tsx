import {
	Container,
	Data,
	Icon,
	SnapperNav,
	SpinnerIcon,
	useSelection,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, useRef } from "react";
import { withCategoryGroupCountQuery } from "~/app/category-group/query/withCategoryGroupCountQuery";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/CategoryGroupItem";

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
	const categoryGroupCountQuery = withCategoryGroupCountQuery().useQuery({});

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
						<Data
							result={categoryGroupCountQuery}
							renderSuccess={({ data: { where } }) => (
								<SnapperNav
									containerRef={containerRef}
									iconProps={() => ({
										size: "xs",
									})}
									pages={{
										count: where,
									}}
									orientation={"horizontal"}
									tweak={{
										slot: {
											root: {
												class: [
													"bg-white/0",
												],
											},
										},
									}}
								/>
							)}
						/>

						<Container
							ref={containerRef}
							layout={"horizontal-full"}
							overflow={"horizontal"}
							snap={"horizontal-start"}
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
