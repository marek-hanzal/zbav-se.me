import {
	Container,
	Data,
	Icon,
	SnapperNav,
	SpinnerIcon,
	Status,
	Tx,
	useSelection,
} from "@use-pico/client";
import type { Category } from "@zbav-se.me/sdk";
import { type FC, useEffect, useId, useRef } from "react";
import { withCategoryCountQuery } from "~/app/category/query/withCategoryCountQuery";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryItem } from "~/app/listing/ui/CreateListing/Category/CategoryItem";
import { Sheet } from "~/app/sheet/Sheet";
import { QuestionIcon } from "~/app/ui/icon/QuestionIcon";

export const CategoryWrapper: FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);
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
		},
	});
	const groupId = useId();
	const grid = 3 * 2;

	// biome-ignore lint/correctness/useExhaustiveDependencies: Scroll-to-top on category change
	useEffect(() => {
		containerRef.current?.scrollTo({
			top: 0,
			behavior: "instant",
		});
	}, [
		categoryQuery.data,
	]);

	if (!hasCategoryGroup) {
		return (
			<Sheet
				tone={"warning"}
				theme={"light"}
				disabled
			>
				<Status
					icon={QuestionIcon}
					tone={"warning"}
					theme={"light"}
					textTitle={
						<Tx
							label="No category selected"
							tone={"warning"}
							theme={"light"}
							font={"bold"}
						/>
					}
					textMessage={
						<Tx
							label={
								"Please select a category group first to see available categories"
							}
							tone={"warning"}
							theme={"light"}
						/>
					}
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
					<div className="relative">
						<Data
							result={categoryCountQuery}
							renderSuccess={({ data: { filter } }) => (
								<SnapperNav
									containerRef={containerRef}
									pages={{
										count: Math.ceil(filter / grid),
									}}
									orientation={"horizontal"}
									iconProps={() => ({
										size: "xs",
										tone: "secondary",
										theme: "light",
									})}
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
													<CategoryItem
														key={item.id}
														selection={
															categorySelection
														}
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
