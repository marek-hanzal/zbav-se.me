import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	Data,
	useSelection,
	type useSnapperNav,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, useEffect, useId, useRef } from "react";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/CategoryGroupItem";
import { Sheet } from "~/app/sheet/Sheet";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { SpinnerSheet } from "~/app/ui/spinner/SpinnerSheet";
import { Title } from "~/app/ui/title/Title";

export namespace CategoryGroupWrapper {
	export interface Props {
		listingNav: useSnapperNav.Result;
		locale: string;
	}
}

export const CategoryGroupWrapper: FC<CategoryGroupWrapper.Props> = ({
	listingNav,
	locale,
}) => {
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

	return (
		<FlowContainer>
			<Title
				textTitle={
					selection.optional.single()?.name ??
					"Listing category groups (title)"
				}
				right={<>number of pages/current page?</>}
			/>

			<Data
				result={categoryGroupQuery}
				renderLoading={() => {
					return <SpinnerSheet />;
				}}
				renderSuccess={({ data }) => {
					return (
						<div className="relative">
							<Container
								ref={snapperRef}
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
												tone={"primary"}
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
						</div>
					);
				}}
			/>

			<BottomContainer>
				<Button
					iconEnabled={ArrowLeftIcon}
					iconPosition={"left"}
					tone={"secondary"}
					theme={"light"}
					onClick={() => listingNav.prev()}
				/>

				<Button
					iconEnabled={ArrowRightIcon}
					iconPosition={"right"}
					disabled={!selection.hasAny}
					tone={"secondary"}
					theme={"dark"}
					onClick={() => listingNav.next()}
				/>
			</BottomContainer>
		</FlowContainer>
	);
};
