import {
	Container,
	Data,
	SnapperNav,
	useSelection,
	useSnapperNav,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, memo, useEffect, useId, useRef } from "react";
import { withCategoryGroupCountQuery } from "~/app/category-group/query/withCategoryGroupCountQuery";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/CategoryGroupItem";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";
import { Sheet } from "~/app/sheet/Sheet";
import { SpinnerSheet } from "~/app/ui/spinner/SpinnerSheet";

export namespace CategoryGroupWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
		locale: string;
	}
}

export const CategoryGroupWrapper: FC<CategoryGroupWrapper.Props> = memo(
	({ listingNav, locale }) => {
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
			},
		});
		const snapperRef = useRef<HTMLDivElement>(null);
		const groupId = useId();
		/**
		 * If you change this, don't forget to update also styles for grid!
		 */
		const grid = 3 * 2;

		// biome-ignore lint/correctness/useExhaustiveDependencies: We're watching data
		useEffect(() => {
			selection.clear();
			setCategory([]);
		}, [
			categoryGroupQuery.data,
		]);

		const snapperNav = useSnapperNav({
			containerRef: snapperRef,
			orientation: "horizontal",
			count: Math.ceil(
				(categoryGroupCountQuery.data?.filter ?? 0) / grid,
			),
		});

		return (
			<ListingContainer
				listingNavApi={listingNav.api}
				textTitle={
					selection.optional.single()?.name ??
					"Listing category groups (title)"
				}
				bottom={{
					next: selection.hasAny,
				}}
			>
				<Data
					result={categoryGroupQuery}
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
													"CategoryGroupWrapper-Data-Container[success]",
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
																	"CategoryGroupWrapper-Item-Sheet",
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
															<CategoryGroupItem
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
