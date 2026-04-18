import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withCategoryQuery } from "~/session/category/withCategoryQuery";

export namespace CategoryInline {
	export interface Props extends Container.Props, MarkSuspense.Props {
		categoryId: string;
		textGroupProps?: Typo.PropsEx;
		textCategoryProps?: Typo.PropsEx;
	}
}

/**
 * Renders category data inline so it can fit dense UI rows without extra wrappers.
 * Use it where space is limited and category still needs to remain readable.
 *
 * @see src/draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryInline = withFallback(
	({
		_suspense,
		categoryId,
		textGroupProps,
		textCategoryProps,
		...props
	}: CategoryInline.Props) => {
		const { data: category } = withCategoryQuery.useFetchQuery(categoryId);

		return (
			<Container
				data-ui="CategoryInline"
				ui={{
					flow: "vertical",
					gap: "xs",
					items: "start",
					...ui,
				}}
				{...props}
			>
				<Typo
					label={category.group}
					ui={{
						tone: "secondary",
						theme: "light",
						text: "default",
						opacity: "6",
					}}
					{...textGroupProps}
				/>

				<Typo
					label={category.category}
					ui={{
						tone: "secondary",
						theme: "light",
						text: "default",
					}}
					{...textCategoryProps}
				/>
			</Container>
		);
	},
	(props: SpinnerContainer.Props) => {
		return (
			<SpinnerContainer
				data-ui={"CategoryValueListContent-[SpinnerContainer.category-inline]"}
				{...props}
			/>
		);
	},
);
