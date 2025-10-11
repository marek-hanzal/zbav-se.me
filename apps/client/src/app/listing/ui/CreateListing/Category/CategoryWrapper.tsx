import {
	Container,
	Data,
	Icon,
	SpinnerIcon,
	Status,
	Tx,
	useSelection,
} from "@use-pico/client";
import type { Category } from "@zbav-se.me/sdk";
import { type FC, useEffect, useRef } from "react";
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

	const categoryQuery = withCategoryListQuery().useQuery(
		{
			filter: {
				categoryGroupIdIn: categoryGroupSelection.map(
					(item) => item.id,
				),
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
					<Container
						ref={containerRef}
						layout={"vertical-full"}
						overflow={"vertical"}
						snap={"vertical-start"}
						gap={"md"}
					>
						{data.map((item) => {
							return (
								<CategoryItem
									key={item.id}
									selection={categorySelection}
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
