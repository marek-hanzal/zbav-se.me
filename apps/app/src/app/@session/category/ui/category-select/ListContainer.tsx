import { useLocale, useMergeRefs, useScrollTo, type useSelection } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import { Status } from "@use-pico/client/ui/status";
import type { EntitySchema } from "@use-pico/common/schema";
import { withCategoryCollectionQuery } from "@zbav-se.me/sdk/query/session";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { uiWarningStatus } from "@zbav-se.me/ui/ui";
import { type FC, useEffect, useRef } from "react";
import { CategoryItem } from "./CategoryItem";

export namespace ListContainer {
	export interface Props extends Container.Props, MarkSuspense.Props {
		fulltext: Fulltext.Value;
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

export const ListContainer: FC<ListContainer.Props> = ({
	_suspense,
	ref,
	fulltext,
	selection,
	categoryId,
	...props
}) => {
	const locale = useLocale();
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
				order: "asc",
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

	if (categoryQuery.data.length === 0) {
		return (
			<Container
				data-ui="ListContainer[Container.empty]"
				ui={{
					layout: "vertical-centered",
					height: "full",
				}}
			>
				<Status
					icon={SearchIcon}
					textTitle={"No categories found (title)"}
					textMessage={"No categories found (message)"}
					{...uiWarningStatus({
						className: [],
					})}
					data-ui="ListContainer-[Status.empty]"
				/>
			</Container>
		);
	}

	return categoryQuery.data.length > 0 ? (
		<Container
			data-ui="ListContainer[Container.content]"
			ref={mergedRef}
			ui={{
				layout: "vertical-flex",
				scroll: "vertical",
				gap: "default",
			}}
			{...props}
		>
			{categoryQuery.data.map((item) => {
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
