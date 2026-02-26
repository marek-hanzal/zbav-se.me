import { useLocale, useMergeRefs, useScrollTo, type useSelection } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import type { EntitySchema } from "@use-pico/common/schema";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import { type FC, useEffect, useRef } from "react";
import { CategoryItem } from "~/app/v0/@session/category/ui/CategorySelect/CategoryItem";
import { Empty } from "./Empty";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		fulltext: Fulltext.Value;
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	ref,
	fulltext,
	selection,
	categoryId,
	...props
}) => {
	const locale = useLocale();
	const { data: categoryIds } = withCategoryQuery.useCollectionQuery({
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
	/**
	 * Category count is a bit fake, but it's much cheaper to ask single entity that running count server-side
	 */
	const { data: categoryCount } = withCategoryQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
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
		categoryIds,
	]);

	if (categoryCount.length === 0) {
		return <Empty />;
	}

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
			}}
		>
			<Container
				data-ui="ListContainer[Container.content]"
				ref={mergedRef}
				ui={{
					flow: "vertical",
					gap: "default",
				}}
				{...props}
			>
				{categoryIds.map((categoryId) => {
					return (
						<CategoryItem
							key={categoryId}
							categoryId={categoryId}
							selection={selection}
						/>
					);
				})}
			</Container>
		</Container>
	);
};
