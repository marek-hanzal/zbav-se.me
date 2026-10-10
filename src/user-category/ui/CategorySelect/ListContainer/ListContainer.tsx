import { useEffect, useRef } from "react";
import type { EntitySchema } from "~/entity/schema/EntitySchema";
import { useLocale } from "~/locale/hook/useLocale";
import { useScrollTo } from "~/navigation/hook/useScrollTo";
import type { useSelection } from "~/selection/hook/useSelection";
import { withFallbackFn } from "~/ui/fn/withFallbackFn";
import { useMergeRefs } from "~/ui/hook/useMergeRefs";
import { Container } from "~/ui/ui/Container";
import type { Fulltext } from "~/ui/ui/Fulltext";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { withCategoryQuery } from "~/user-category/query/withCategoryQuery";
import { CategoryItem } from "~/user-category/ui/CategorySelect/CategoryItem.exports";
import { Empty } from "~/user-category/ui/CategorySelect/ListContainer/Empty";

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
export const ListContainer = withFallbackFn(
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
		const scrollToFn = useScrollTo(containerRef);
		const mergedRef = useMergeRefs([
			ref,
			containerRef,
		]);

		// biome-ignore lint/correctness/useExhaustiveDependencies: OK
		useEffect(() => {
			if (categoryId) {
				scrollToFn(`[data-id=${categoryId}]`, {
					behavior: "instant",
				});
			}
		}, [
			categoryId,
			scrollToFn,
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
