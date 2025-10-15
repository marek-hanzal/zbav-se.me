import {
	Container,
	Data,
	DotIcon,
	type Fulltext,
	Icon,
	SnapperNav,
	SpinnerIcon,
	useSelection,
	useSnapperNav,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, useEffect, useId, useRef, useState } from "react";
import { withCategoryGroupCountQuery } from "~/app/category-group/query/withCategoryGroupCountQuery";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/CategoryGroupItem";
import { Sheet } from "~/app/sheet/Sheet";
import { SearchIcon } from "~/app/ui/icon/SearchIcon";
import { SearchSheet } from "~/app/ui/search/SearchSheet";

export namespace CategoryGroupWrapper {
	export interface Props {
		locale: string;
	}
}

export const CategoryGroupWrapper: FC<CategoryGroupWrapper.Props> = ({
	locale,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [search, setSearch] = useState<Fulltext.Value>(undefined);
	const useCreateListingStore = useCreateListingContext();
	const setCategoryGroup = useCreateListingStore(
		(store) => store.setCategoryGroup,
	);
	const setCategory = useCreateListingStore((store) => store.setCategory);
	const selection = useSelection<CategoryGroup>({
		mode: "single",
		onMulti: setCategoryGroup,
	});

	const categoryGroupQuery = withCategoryGroupListQuery().useQuery({
		filter: {
			locale,
			fulltext: search,
		},
		sort: [
			{
				value: "sort",
				sort: "asc",
			},
		],
	});
	const categoryGroupCountQuery = withCategoryGroupCountQuery().useQuery({
		filter: {
			locale,
			fulltext: search,
		},
	});
	const groupId = useId();
	/**
	 * If you change this, don't forget to update also styles for grid!
	 */
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
		selection.clear();
		setCategory([]);
		search && snapperNav.snapTo(1);
	}, [
		categoryGroupQuery.data,
	]);

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
							// tone={"secondary"}
							// theme={"light"}
							gap={"md"}
						>
							<SearchSheet
								state={{
									value: search,
									set: setSearch,
								}}
								query={categoryGroupQuery}
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
													<CategoryGroupItem
														key={item.id}
														selection={selection}
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
