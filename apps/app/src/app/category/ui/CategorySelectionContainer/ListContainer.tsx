import { useMergeRefs, useScrollTo, type useSelection } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import { Status } from "@use-pico/client/ui/status";
import type { EntitySchema } from "@use-pico/common/schema";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { type FC, useEffect, useRef } from "react";
import { CategoryItem } from "./CategoryItem";

export namespace ListContainer {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		fulltext: Fulltext.Value;
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

export const ListContainer: FC<ListContainer.Props> = ({
	_suspense,
	ref,
	locale,
	fulltext,
	selection,
	categoryId,
	...props
}) => {
	const categoryQuery = withCategoryCollectionQuery.useSuspenseQuery({
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

	const containerRef = useRef<HTMLDivElement>(null);
	const scrollTo = useScrollTo(containerRef);
	const mergedRef = useMergeRefs([
		ref,
		containerRef,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: OK
	useEffect(() => {
		if (categoryId) {
			scrollTo(`[data-id=${categoryId}]`, {
				behavior: "instant",
			});
		}
	}, [
		categoryId,
		scrollTo,
		categoryQuery.data,
	]);

	if (categoryQuery.data.data.length === 0) {
		return (
			<Status
				icon={SearchIcon}
				textTitle={"No categories found (title)"}
				textMessage={"No categories found (message)"}
			/>
		);
	}

	return categoryQuery.data.data.length > 0 ? (
		<Container
			data-ui="CategorySelectionContainer-ListContainer"
			ref={mergedRef}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "default",
			}}
			{...props}
		>
			{categoryQuery.data.data.map((item) => {
				return (
					<CategoryItem
						key={item.id}
						selection={selection}
						item={item}
					/>
				);
			})}
		</Container>
	) : null;
};
