import { useLocale, useMergeRefs, useScrollTo, type useSelection } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { Fulltext } from "@use-pico/client/ui/fulltext";
import { withFallback } from "@use-pico/client/utils";
import type { EntitySchema } from "@use-pico/common/schema";
import { Suspense, useEffect, useRef } from "react";
import { withCategoryQuery } from "~/session/category/withCategoryQuery";
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
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const ListContainer = withFallback(
	({ ref, fulltext, selection, categoryId, ...props }: ListContainer.Props) => {
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
