import type { useSelection } from "@use-pico/client/hook";
import { useScrollTo } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { Fulltext } from "@use-pico/client/ui/fulltext";
import { Status } from "@use-pico/client/ui/status";
import { Typo } from "@use-pico/client/ui/typo";
import type { EntitySchema } from "@use-pico/common/schema";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { SpinnerContainer } from "@zbav-se.me/ui/container";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { type FC, type RefObject, useEffect, useRef, useState } from "react";

export namespace CategorySelection {
	export interface Props {
		ref?: RefObject<HTMLDivElement | null>;
		locale: string;
		selection: useSelection.Selection<EntitySchema.Type>;
	}
}

export const CategorySelection: FC<CategorySelection.Props> = ({
	ref,
	locale,
	selection,
}) => {
	const [fulltext, setFulltext] = useState<Fulltext.Value>();
	const scrollRef = useRef<HTMLDivElement>(null);
	const scrollTo = useScrollTo(scrollRef);
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
				field: "sort",
				direction: "asc",
			},
		],
	});

	const categoryIds = selection.optional.multiId();

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're OK
	useEffect(() => {
		scrollTo(`.CategoryItem-${categoryIds[0]}`);
	}, [
		categoryQuery.data,
	]);

	return (
		<Container
			ui="CategorySelection-root"
			ref={ref}
			layout={"vertical-header-content"}
			gap={"md"}
			round={"lg"}
		>
			<Fulltext
				state={{
					value: fulltext,
					set: setFulltext,
				}}
				textPlaceholder={"Category search (placeholder)"}
				tweak={{
					slot: {
						input: {
							class: [
								"px-8",
							],
							token: [
								"size.lg",
							],
						},
					},
				}}
			/>

			<Data
				result={categoryQuery}
				renderSuccess={({ data }) => {
					if (data.data.length === 0) {
						return (
							<Status
								icon={SearchIcon}
								textTitle={"No categories found (title)"}
								textMessage={"No categories found (message)"}
							/>
						);
					}

					return (
						<Container
							ref={scrollRef}
							layout={"vertical-flex"}
							scroll={"vertical"}
							gap={"sm"}
						>
							{data.data.map((item) => {
								const selected = selection.isSelected(item.id);

								return (
									<Button
										ui="CategoryItem-root"
										key={item.id}
										full
										tone={"primary"}
										theme={selected ? "dark" : "light"}
										onClick={() => {
											selection.toggle(item);
										}}
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
							textTitle={"No categories found (title)"}
							textMessage={"No categories found (message)"}
						/>
					);
				}}
			/>
		</Container>
	);
};
