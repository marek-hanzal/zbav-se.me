import {
	Container,
	Data,
	Icon,
	Sheet,
	SpinnerIcon,
	Status,
	Tx,
	useSelection,
} from "@use-pico/client";
import type { FC } from "react";
import type { CategorySchema } from "~/app/category/db/CategorySchema";
import { withCategoryListQuery } from "~/app/category/query/withCategoryListQuery";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { CategoryItem } from "~/app/listing/ui/CreateListing/Category/CategoryItem";
import { QuestionIcon } from "~/app/ui/icon/QuestionIcon";

export const Category: FC = () => {
	const useCreateListingStore = useCreateListingContext();
	const setCategory = useCreateListingStore((store) => store.setCategory);
	const categoryGroupSelection = useCreateListingStore(
		(store) => store.categoryGroup,
	);
	const categorySelection = useSelection<CategorySchema.Type>({
		mode: "multi",
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

	if (!hasCategoryGroup) {
		return (
			<div
				key={`category-wrapper-empty`}
				className="h-full"
			>
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
			</div>
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
						layout={"vertical-full"}
						overflow={"vertical"}
						snap={"vertical-start"}
						gap={"md"}
					>
						{data.map((item) => {
							return (
								<CategoryItem
									key={item.id}
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
