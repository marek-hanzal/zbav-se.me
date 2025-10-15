import {
	Badge,
	Container,
	Data,
	DotIcon,
	Fulltext,
	Icon,
	Sheet,
	SnapperNav,
	SpinnerIcon,
	Status,
	Tx,
	useSelection,
	useSnapperNav,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, useEffect, useId, useRef, useState } from "react";
import { withCategoryGroupCountQuery } from "~/app/category-group/query/withCategoryGroupCountQuery";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/CategoryGroupItem";
import { SearchIcon } from "~/app/ui/icon/SearchIcon";

export const CategoryGroupWrapper: FC = () => {
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
		setCategoryGroup([]);
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
							tone={"secondary"}
							theme={"light"}
							gap={"md"}
						>
							<Sheet>
								<Status
									icon={SearchIcon}
									textTitle={<Tx label={"Search (title)"} />}
									tweak={{
										slot: {
											body: {
												class: [
													"flex",
													"flex-col",
													"gap-2",
													"items-center",
													"w-full",
													"px-8",
												],
											},
										},
									}}
								>
									<Fulltext
										state={{
											value: search,
											set: setSearch,
										}}
									/>

									<Data
										result={categoryGroupQuery}
										renderSuccess={({ data }) => {
											return (
												<Badge
													size={"lg"}
													tone={"primary"}
													theme={"dark"}
													tweak={{
														slot: {
															root: {
																class: [
																	"transition-opacity",
																	data.length >
																	0
																		? [
																				"opacity-0",
																			]
																		: undefined,
																],
															},
														},
													}}
												>
													<Tx
														label={
															"Nothing found (badge)"
														}
													/>
												</Badge>
											);
										}}
									/>
								</Status>
							</Sheet>

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
