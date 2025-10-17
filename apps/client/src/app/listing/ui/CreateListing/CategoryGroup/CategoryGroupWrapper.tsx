import {
	Container,
	Data,
	Icon,
	SpinnerIcon,
	useSelection,
} from "@use-pico/client";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { type FC, useEffect, useId } from "react";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryGroupItem } from "~/app/listing/ui/CreateListing/CategoryGroup/Item/CategoryGroupItem";
import { Sheet } from "~/app/sheet/Sheet";
import { Title } from "~/app/ui/title/Title";

export namespace CategoryGroupWrapper {
	export interface Props {
		locale: string;
	}
}

export const CategoryGroupWrapper: FC<CategoryGroupWrapper.Props> = ({
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
		<Container
			layout={"vertical-header-content-footer"}
			tone={"secondary"}
			theme={"light"}
			square={"md"}
			gap={"xs"}
		>
			<Title
				title={
					selection.optional.single()?.name ??
					"Listing category groups (title)"
				}
			/>

			<Data
				result={categoryGroupQuery}
				renderLoading={() => {
					return (
						<Sheet>
							<Icon
								icon={SpinnerIcon}
								theme={"light"}
								tone={"secondary"}
								size={"2xl"}
							/>
						</Sheet>
					);
				}}
				renderSuccess={({ data }) => {
					return (
						<div className="relative">
							<Container
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

			<Container
				tone={"primary"}
				theme={"light"}
				round={"lg"}
				square={"md"}
				border={"default"}
			>
				hovno
			</Container>
		</Container>
	);
};
