import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	Container,
	Data,
	LinkTo,
	useSelection,
} from "@use-pico/client";
import { translator } from "@use-pico/common";
import type { CategoryGroup } from "@zbav-se.me/sdk";
import { useEffect, useRef } from "react";
import z from "zod";
import { withCategoryGroupListQuery } from "~/app/category-group/query/withCategoryGroupListQuery";
import { CategoryGroupItem } from "~/app/category-group/ui/CategoryGroupItem";
import { ListingContainer } from "~/app/listing/ui/CreateListing/ListingContainer";

export const Route = createFileRoute("/$locale/listing/wizard/category-group")({
	validateSearch: z.object({
		uploadIds: z.array(z.string()).min(1, {
			error() {
				return translator.text("At least one photo is required!");
			},
		}),
		categoryGroupId: z.string().optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const { uploadIds, categoryGroupId } = Route.useSearch();
		const navigate = Route.useNavigate();
		const selection = useSelection<CategoryGroup>({
			mode: "single",
			onMulti(items) {
				navigate({
					search({ categoryGroupId, ...prev }) {
						return {
							...prev,
							categoryGroupId: items[0]?.id,
						};
					},
				});
			},
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
		const containerRef = useRef<HTMLDivElement>(null);

		useEffect(() => {
			selection.clear();
			navigate({
				search(prev) {
					return {
						...prev,
						categoryGroupId: undefined,
					};
				},
			});
		}, [
			categoryGroupQuery.data,
		]);

		return (
			<ListingContainer
				ui="CategoryGroup-root"
				textTitle={"Listing category groups (title)"}
				textSubtitle={
					selection.optional.single()?.name ??
					"Listing category groups (subtitle)"
				}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/listing/wizard/photos"}
						search={{
							uploadIds,
						}}
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
							search={{
								uploadIds,
								categoryGroupId,
							}}
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
					result={categoryGroupQuery}
					renderSuccess={({ data }) => {
						return (
							<Container
								ref={containerRef}
								layout={"vertical-content"}
								height={"full"}
								overflow={"vertical"}
							>
								<Container
									ui="CategoryGroup-Container"
									layout={"vertical-content"}
									gap={"md"}
								>
									{data.map((item) => {
										return (
											<CategoryGroupItem
												key={item.id}
												selection={selection}
												item={item}
											/>
										);
									})}
								</Container>
							</Container>
						);
					}}
				/>
			</ListingContainer>
		);
	},
});
