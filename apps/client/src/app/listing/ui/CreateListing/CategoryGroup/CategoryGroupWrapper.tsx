import {
	Container,
	Data,
	Icon,
	SnapperNav,
	SpinnerIcon,
	useSelection,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, useId, useRef } from "react";
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
	const groupId = useId();
	const grid = 3 * 2;

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
							renderSuccess={({ data: { filter } }) => (
								<SnapperNav
									containerRef={containerRef}
									iconProps={() => ({
										size: "xs",
									})}
									pages={{
										count: Math.ceil(filter / grid),
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
							tone={"secondary"}
							theme={"light"}
							gap={"md"}
						>
							{Array.from(
								{
									length: Math.ceil(data.length / grid),
								},
								(_, chunkIndex) => {
									const startIndex = chunkIndex * grid;
									const chunk = data.slice(
										startIndex,
										startIndex + grid,
									);

									return (
										<div
											key={`${groupId}-${chunkIndex}-${startIndex}`}
											className="grid grid-rows-3 grid-cols-2 gap-2 h-full w-full p-4"
										>
											{chunk.map((item) => {
												return (
													<CategoryGroupItem
														key={item.id}
														selection={selection}
														item={item}
													/>
												);
											})}
										</div>
									);
								},
							)}
						</Container>
					</div>
				);
			}}
		/>
	);
};
