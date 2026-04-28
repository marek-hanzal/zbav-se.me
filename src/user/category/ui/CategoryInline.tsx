import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withCategoryQuery } from "~/user/category/query/withCategoryQuery";

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
				data-ui-flow="vertical"
				data-ui-gap="xs"
				data-ui-items="start"
				{...props}
			>
				<Typo
					label={category.group}
					data-ui-tone="secondary"
					data-ui-theme="light"
					data-ui-text="default"
					data-ui-opacity="6"
					{...textGroupProps}
				/>

				<Typo
					label={category.category}
					data-ui-tone="secondary"
					data-ui-theme="light"
					data-ui-text="default"
					{...textCategoryProps}
				/>
			</Container>
		);
	},
	(props: SpinnerContainer.Props) => {
		return (
			<SpinnerContainer
				data-ui={"CategoryInline"}
				{...props}
			/>
		);
	},
);
