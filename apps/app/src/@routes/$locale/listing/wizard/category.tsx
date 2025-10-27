import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	Data,
	LinkTo,
	useScrollTo,
	useSelection,
} from "@use-pico/client";
import type { EntitySchema } from "@use-pico/common";
import type { Category } from "@zbav-se.me/sdk";
import { Fade } from "@zbav-se.me/ui";
import type { FC } from "react";
import { useEffect, useRef } from "react";
import { withCategoryCollectionQuery } from "~/app/category/query/withCategoryCollectionQuery";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

// biome-ignore lint/correctness/noUnusedVariables: Private
namespace CategoryItem {
	export interface Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		item: Category;
	}
}

// biome-ignore lint/style/useComponentExportOnlyModules: Private
const CategoryItem: FC<CategoryItem.Props> = ({ selection, item }) => {
	const isSelected = selection.isSelected(item.id);

	return (
		<Button
			ui="CategoryItem-root"
			tone={"primary"}
			theme={isSelected ? "dark" : "light"}
			onClick={() => {
				selection.toggle(item);
			}}
			full
			size={"xl"}
			tweak={{
				slot: {
					wrapper: {
						class: [
							`CategoryGroupItem-${item.id}`,
						],
					},
				},
			}}
		>
			{item.name}
		</Button>
	);
};

export const Route = createFileRoute("/$locale/listing/wizard/category")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const selection = useSelection<EntitySchema.Type>({
			mode: "single",
			initial: state.categoryId
				? [
						{
							id: state.categoryId,
						},
					]
				: undefined,
			onMulti(items) {
				navigate({
					search({ categoryId, ...prev }) {
						return {
							...prev,
							categoryId: items[0]?.id,
						};
					},
				});
			},
		});
		const categoryQuery = withCategoryCollectionQuery().useQuery({
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
		const containerRef = useRef<HTMLDivElement>(null);
		const scrollTo = useScrollTo(containerRef);

		useEffect(() => {
			if (state.categoryId) {
				scrollTo(`.CategoryItem-${state.categoryId}`);
			}
		}, [
			state.categoryId,
			categoryQuery.data,
			scrollTo,
		]);

		return (
			<ListingContainer
				ui="Category-root"
				textTitle={"Listing category (title)"}
				textSubtitle={"Listing category (subtitle)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/photos"}
						search={state}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				bottom={{
					next: (
						<LinkTo
							to={"/$locale/listing/wizard/category"}
							params={{
								locale,
							}}
							search={state}
							disabled={!selection.hasAny}
						>
							<Button
								tone={"secondary"}
								theme={"dark"}
								iconEnabled={ArrowRightIcon}
								disabled={!selection.hasAny}
								size={"lg"}
							/>
						</LinkTo>
					),
				}}
			>
				<Data
					result={categoryQuery}
					renderSuccess={({ data }) => {
						return (
							<Container
								layout={"vertical"}
								position={"relative"}
							>
								<Fade scrollableRef={containerRef} />

								<Container
									ref={containerRef}
									layout={"vertical-content"}
									overflow={"vertical"}
									position={"relative"}
								>
									<Container
										ui="Category-Container"
										layout={"vertical-content"}
										gap={"md"}
									>
										{data.map((item) => {
											return (
												<CategoryItem
													key={item.id}
													selection={selection}
													item={item}
												/>
											);
										})}
									</Container>
								</Container>
							</Container>
						);
					}}
				/>
			</ListingContainer>
		);
	},
});
