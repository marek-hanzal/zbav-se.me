import { useEffect, useRef } from "react";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import type { Fulltext } from "@/lib/client/fulltext";
import { useLocale } from "@/lib/client/locale";
import { useMergeRefs } from "@/lib/client/ref";
import { useScrollTo } from "@/lib/client/scroll-to";
import type { useSelection } from "@/lib/client/selection";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { EntitySchema } from "@/lib/common/schema";
import { withCategoryQuery } from "~/user/category/query/withCategoryQuery";
import { CategoryItem } from "../CategoryItem";
import { Empty } from "./Data/Empty";

export namespace ListContainer {
	export interface Props extends Container.Props {
		fulltext: Fulltext.Value;
		selection: useSelection.Use<EntitySchema.Type>;
		categoryId: string | undefined;
		/**
		 * Controls if restricted categories are shown: useful e.g. for drafts when
		 * you can create restricted content.
		 */
		withRestriction: boolean;
	}
}

/**
 * Coordinates category result rendering across loading, empty, and resolved query states.
 * Use it in category pickers that combine fulltext input with async category fetching.
 */
export const ListContainer = withFallback(
	({ ref, fulltext, selection, categoryId, withRestriction, ...props }: ListContainer.Props) => {
		const locale = useLocale();
		const { data: categories } = withCategoryQuery.useCollectionQuery({
			where: {
				withRestriction,
				locale,
				fulltext: fulltext
					? [
							fulltext,
						]
					: undefined,
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
			categories,
		]);

		if (categories.length === 0) {
			return <Empty />;
		}

		return (
			<Container
				data-ui={"ListContainer"}
				data-ui-scroll="vertical"
				data-ui-height="full"
			>
				<Container
					ref={mergedRef}
					data-ui-flow="vertical"
					data-ui-gap="default"
					{...props}
				>
					{categories.map((category) => {
						return (
							<CategoryItem
								key={category.id}
								category={category}
								selection={selection}
							/>
						);
					})}
				</Container>
			</Container>
		);
	},
	SpinnerContainer,
);
