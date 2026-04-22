import { Suspense, useEffect, useRef } from "react";
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
		selection: useSelection.Selection<EntitySchema.Type>;
		categoryId: string | undefined;
	}
}

/**
 * Coordinates category result rendering across loading, empty, and resolved query states.
 * Use it in category pickers that combine fulltext input with async category fetching.
 *
 * @see src/draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const ListContainer = withFallback(
	({ ref, fulltext, selection, categoryId, ...props }: ListContainer.Props) => {
		const locale = useLocale();
		const { data: categoryIds } = withCategoryQuery.useIdsQuery({
			filter: {
				locale,
				fulltext,
			},
			where: {
				withRestriction: true,
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
				data-ui-scroll="vertical"
				data-ui-height="full"
			>
				<Container
					data-ui="ListContainer[Container.content]"
					ref={mergedRef}
					data-ui-flow="vertical"
					data-ui-gap="default"
					{...props}
				>
					{categoryIds.map((categoryId) => {
						return (
							<Suspense
								key={categoryId}
								fallback={<CategoryItem.Fallback />}
							>
								<CategoryItem
									categoryId={categoryId}
									selection={selection}
								/>
							</Suspense>
						);
					})}
				</Container>
			</Container>
		);
	},
	SpinnerContainer,
);
