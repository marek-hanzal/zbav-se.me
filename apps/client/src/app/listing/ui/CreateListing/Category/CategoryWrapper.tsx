import {
	Container,
	Data,
	SnapperNav,
	Status,
	useSelection,
	useSnapperNav,
} from "@use-pico/client";
import type { Category } from "@zbav-se.me/sdk";
import { type FC, memo, useEffect, useId, useRef } from "react";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryItem } from "~/app/listing/ui/CreateListing/Category/CategoryItem";
import { LeftButton } from "~/app/listing/ui/CreateListing/LeftButton";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { Sheet } from "~/app/sheet/Sheet";
import { CategoryIcon } from "~/app/ui/icon/CategoryIcon";
import { SpinnerSheet } from "~/app/ui/spinner/SpinnerSheet";

export namespace CategoryWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
		locale: string;
	}
}

export const CategoryWrapper: FC<CategoryWrapper.Props> = memo(
	({ listingNav, locale }) => {
		const snapperRef = useRef<HTMLDivElement>(null);
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

		const snapperNav = useSnapperNav({
			containerRef: snapperRef,
			orientation: "horizontal",
			count: Math.ceil((categoryQuery.data?.length ?? 0) / grid),
		});

		// biome-ignore lint/correctness/useExhaustiveDependencies: We're watching data
		useEffect(() => {
			selection.clear();
		}, [
			categoryGroupSelection,
			categoryQuery.data,
		]);

		if (!hasCategoryGroup) {
			return (
				<ListingContainer listingNavApi={listingNav.api}>
					<div />

					<Sheet
						tone={"primary"}
						theme={"light"}
					>
						<Status
							icon={CategoryIcon}
							tone={"primary"}
							theme={"light"}
							textTitle="No category selected"
							textMessage="Please select a category group first to see available categories"
							action={
								<LeftButton
									border
									background
									size={"lg"}
									listingNavApi={listingNav.api}
									label={"Select category group (button)"}
									iconProps={{
										size: "sm",
									}}
								/>
							}
						/>
					</Sheet>
				</ListingContainer>
			);
		}

		return (
			<ListingContainer
				listingNavApi={listingNav.api}
				textTitle={
					selection.optional.single()?.name ??
					"Listing category (title)"
				}
				bottom={{
					next: selection.hasAny,
				}}
			>
				<Data
					result={categoryQuery}
					renderLoading={() => {
						return <SpinnerSheet />;
					}}
					renderSuccess={({ data }) => {
						return (
							<>
								<SnapperNav
									snapperNav={snapperNav}
									orientation={"horizontal"}
									iconProps={() => ({
										size: "sm",
									})}
									tweak={{
										slot: {
											root: {
												class: [
													"bottom-0",
												],
											},
										},
									}}
									subtle
								/>

								<Container
									ref={snapperRef}
									layout={"horizontal-full"}
									overflow={"horizontal"}
									snap={"horizontal-start"}
									gap={"md"}
									tweak={{
										slot: {
											root: {
												class: [
													"CategoryWrapper-Data-Container[success]",
												],
											},
										},
									}}
								>
									{Array.from(
										{
											length: Math.ceil(
												data.length / grid,
											),
										},
										(_, chunkIndex) => {
											const startIndex =
												chunkIndex * grid;
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
																	"CategoryWrapper-Item-Sheet",
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
							</>
						);
					}}
				/>
			</ListingContainer>
		);
	},
);
