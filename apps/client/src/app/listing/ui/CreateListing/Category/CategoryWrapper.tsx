import {
	Container,
	Data,
	DotIcon,
	type Fulltext,
	Icon,
	SnapperNav,
	SpinnerIcon,
	Status,
	useSelection,
	useSnapperNav,
} from "@use-pico/client";
import type { Category } from "@zbav-se.me/sdk";
import { type FC, useEffect, useId, useRef, useState } from "react";
import { withCategoryCountQuery } from "~/app/category/query/withCategoryCountQuery";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryItem } from "~/app/listing/ui/CreateListing/Category/CategoryItem";
import { Sheet } from "~/app/sheet/Sheet";
import { CategoryGroupIcon } from "~/app/ui/icon/CategoryGroupIcon";
import { SearchIcon } from "~/app/ui/icon/SearchIcon";
import { SearchSheet } from "~/app/ui/search/SearchSheet";

export namespace CategoryWrapper {
	export interface Props {
		locale: string;
	}
}

export const CategoryWrapper: FC<CategoryWrapper.Props> = ({ locale }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useState<Fulltext.Value>(undefined);
	const useCreateListingStore = useCreateListingContext();
	const setCategory = useCreateListingStore((store) => store.setCategory);
	const categoryGroupSelection = useCreateListingStore(
		(store) => store.categoryGroup,
	);
	const categorySelection = useSelection<Category>({
		mode: "single",
		onMulti: setCategory,
	});
	const hasCategoryGroup = useCreateListingStore(
		(store) => store.hasCategoryGroup,
	);

	const categoryGroupIds = categoryGroupSelection.map((item) => item.id);
	const categoryQuery = withCategoryListQuery().useQuery(
		{
			filter: {
				categoryGroupIdIn: categoryGroupIds,
				locale,
				fulltext: search,
			},
			sort: [
				{
					value: "sort",
					sort: "asc",
				},
			],
		},
		{
			enabled: categoryGroupSelection.length > 0,
		},
	);
	const categoryCountQuery = withCategoryCountQuery().useQuery({
		filter: {
			categoryGroupIdIn: categoryGroupIds,
			locale,
			fulltext: search,
		},
	});
	const groupId = useId();
	const grid = 3 * 2;

	const snapperNav = useSnapperNav({
		containerRef,
		orientation: "horizontal",
		/**
		 * Hack
		 */
		count: 2,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're watching data
	useEffect(() => {
		categorySelection.clear();
		search && snapperNav.snapTo(1);
	}, [
		categoryGroupSelection,
		categoryQuery.data,
	]);

	if (!hasCategoryGroup) {
		return (
			<Sheet
				tone={"secondary"}
				theme={"light"}
			>
				<Status
					icon={CategoryGroupIcon}
					tone={"secondary"}
					theme={"light"}
					textTitle="No category selected"
					textMessage="Please select a category group first to see available categories"
				/>
			</Sheet>
		);
	}

	return (
		<Data
			result={categoryQuery}
			renderLoading={() => {
				return (
					<div
						key={`category-wrapper-loading`}
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
					<div className="CategoryWrapper-root relative">
						<Data
							result={categoryCountQuery}
							renderSuccess={({ data: { filter } }) => (
								<SnapperNav
									containerRef={containerRef}
									iconProps={() => ({
										size: "xs",
									})}
									pages={[
										{
											id: `${groupId}-page-search`,
											icon: SearchIcon,
										} as SnapperNav.Page,
									].concat(
										Array.from(
											{
												length: Math.ceil(
													filter / grid,
												),
											},
											(_, i) =>
												({
													id: `${groupId}-page-${i}`,
													icon: DotIcon,
												}) as SnapperNav.Page,
										),
									)}
									orientation={"horizontal"}
									defaultIndex={1}
									subtle
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
							<SearchSheet
								state={{
									value: search,
									set: setSearch,
								}}
								query={categoryQuery}
							/>

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
										<Sheet
											key={`${groupId}-${chunkIndex}-${startIndex}`}
											tone={"secondary"}
											theme={"light"}
											tweak={{
												slot: {
													root: {
														class: [
															"grid",
															"grid-rows-3",
															"grid-cols-2",
															"gap-2",
															"h-full",
															"w-full",
															"p-4",
														],
													},
												},
											}}
										>
											{chunk.map((item) => {
												return (
													<CategoryItem
														key={item.id}
														selection={
															categorySelection
														}
														item={item}
													/>
												);
											})}
										</Sheet>
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
