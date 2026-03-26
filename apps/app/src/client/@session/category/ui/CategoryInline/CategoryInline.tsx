import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { withCategoryQuery } from "~/client/@session/category/withCategoryQuery";

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
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/CategoryPatch.tsx
 */
export const CategoryInline = withFallback(
	({
		_suspense,
		ui,
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
