import { createFileRoute } from "@tanstack/react-router";
import { useScrollTo, useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Typo } from "@use-pico/client/ui/typo";
import type { EntitySchema } from "@use-pico/common";
import type { tCategoryDto } from "@zbav-se.me/sdk";
import { SearchIcon, SpinnerContainer, TitleContainer } from "@zbav-se.me/ui";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { withCategoryCollectionQuery } from "~/app/category/query/withCategoryCollectionQuery";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

// biome-ignore lint/correctness/noUnusedVariables: Private
namespace CategoryItem {
	export interface Props {
		selection: useSelection.Selection<EntitySchema.Type>;
		item: tCategoryDto;
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
							`CategoryItem-${item.id}`,
						],
					},
					root: {
						class: [
							"justify-center",
							"items-start",
							"text-left",
							"flex",
							"flex-col",
							"gap-1",
							"w-full",
						],
					},
				},
			}}
		>
			<Typo
				label={item.group}
				size={"sm"}
			/>

			<Typo
				label={item.category}
				size={"lg"}
				font={"bold"}
			/>
		</Button>
	);
};

export const Route = createFileRoute("/$locale/seller/listing/wizard/category")(
	{
		validateSearch: ListingWizardSchema,
		component() {
			const { locale } = Route.useParams();
			const state = Route.useSearch();
			const [fulltext, setFulltext] = useState<Fulltext.Value>();
			const selection = useSelection<EntitySchema.Type>({
				mode: "single",
				initial: state.categoryId
					? [
							{
								id: state.categoryId,
							},
						]
					: undefined,
			});
			const categoryQuery = withCategoryCollectionQuery.useQuery({
				filter: {
					locale,
					fulltext,
				},
				cursor: {
					page: 0,
					size: 256,
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
				categoryQuery.data,
			]);

			return (
				<TitleContainer
					ui="Category-root"
					textTitle={"Listing category (title)"}
					left={
						<LinkTo
							icon={ArrowLeftIcon}
							to={"/$locale/seller/listing/wizard/photos"}
							search={state}
							params={{
								locale,
							}}
							tone={"secondary"}
						/>
					}
					bottom={
						<LinkTo
							to={"/$locale/seller/listing/wizard/condition"}
							params={{
								locale,
							}}
							search={{
								...state,
								categoryId: selection.optional.singleId(),
							}}
							disabled={!selection.hasAny}
							full
						>
							<Button
								tone={"secondary"}
								theme={"dark"}
								iconEnabled={ArrowRightIcon}
								iconPosition={"right"}
								label={"Next - condition (button)"}
								disabled={!selection.hasAny}
								size={"lg"}
								full
							/>
						</LinkTo>
					}
				>
					<Container
						layout={"vertical-header-content"}
						gap={"md"}
						height={"fit"}
					>
						<div className={"min-h-0"}>
							<Fulltext
								state={{
									value: fulltext,
									set: setFulltext,
								}}
							/>
						</div>

						<Data
							result={categoryQuery}
							renderSuccess={({ data }) => {
								return (
									<Container
										ref={containerRef}
										scroll={"vertical"}
										layout={"vertical"}
										gap={"md"}
										height={"fit"}
									>
										{data.data.map((item) => {
											return (
												<CategoryItem
													key={item.id}
													selection={selection}
													item={item}
												/>
											);
										})}
									</Container>
								);
							}}
							renderLoading={() => {
								return (
									<SpinnerContainer
										disableOverlay
										height={"fit"}
									/>
								);
							}}
							renderEmpty={() => {
								return (
									<Status
										icon={SearchIcon}
										textTitle={
											"No categories found (title)"
										}
										textMessage={
											"No categories found (message)"
										}
									/>
								);
							}}
						/>
					</Container>
				</TitleContainer>
			);
		},
	},
);
