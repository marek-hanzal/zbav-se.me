import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	Data,
	Status,
	useSelection,
	type useSnapperNav,
} from "@use-pico/client";
import type { Category } from "@zbav-se.me/sdk";
import { type FC, memo, useEffect, useId, useRef } from "react";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryItem } from "~/app/listing/ui/CreateListing/Category/CategoryItem";
import { Sheet } from "~/app/sheet/Sheet";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { CategoryIcon } from "~/app/ui/icon/CategoryIcon";
import { SpinnerSheet } from "~/app/ui/spinner/SpinnerSheet";
import { Title } from "~/app/ui/title/Title";

export namespace CategoryWrapper {
	export interface Props {
		listingNavApi: useSnapperNav.Api;
		locale: string;
	}
}

export const CategoryWrapper: FC<CategoryWrapper.Props> = memo(
	({ listingNavApi, locale }) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const useCreateListingStore = useCreateListingContext();
		const setCategory = useCreateListingStore((store) => store.setCategory);
		const categoryGroupSelection = useCreateListingStore(
			(store) => store.categoryGroup,
		);
		const selection = useSelection<Category>({
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
		const groupId = useId();
		const grid = 3 * 2;

		// biome-ignore lint/correctness/useExhaustiveDependencies: We're watching data
		useEffect(() => {
			selection.clear();
		}, [
			categoryGroupSelection,
			categoryQuery.data,
		]);

		if (!hasCategoryGroup) {
			return (
				<Sheet
					tone={"secondary"}
					theme={"light"}
					round={"unset"}
				>
					<Status
						icon={CategoryIcon}
						tone={"secondary"}
						theme={"light"}
						textTitle="No category selected"
						textMessage="Please select a category group first to see available categories"
					/>
				</Sheet>
			);
		}

		return (
			<FlowContainer>
				<Title
					textTitle={
						selection.optional.single()?.name ??
						"Listing category (title)"
					}
				/>

				<Data
					result={categoryQuery}
					renderLoading={() => {
						return <SpinnerSheet />;
					}}
					renderSuccess={({ data }) => {
						return (
							<Container
								ref={containerRef}
								layout={"horizontal-full"}
								overflow={"horizontal"}
								snap={"horizontal-start"}
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
											<Sheet
												key={`${groupId}-${chunkIndex}-${startIndex}`}
												tone={"unset"}
												theme={"unset"}
												tweak={{
													slot: {
														root: {
															class: [
																"border-none",
																"shadow-none",
																"grid",
																"grid-rows-3",
																"grid-cols-2",
																"gap-2",
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
																selection
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
						);
					}}
				/>

				<BottomContainer>
					<Button
						iconEnabled={ArrowLeftIcon}
						iconPosition={"left"}
						tone={"secondary"}
						theme={"light"}
						onClick={listingNavApi.prev}
					/>

					<Button
						iconEnabled={ArrowRightIcon}
						iconPosition={"right"}
						disabled={!selection.hasAny}
						tone={"secondary"}
						theme={"dark"}
						onClick={listingNavApi.next}
						size={"lg"}
					/>
				</BottomContainer>
			</FlowContainer>
		);
	},
);
