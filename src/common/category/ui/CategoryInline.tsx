import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Typo } from "@/lib/client/typo";
import type { CategorySchema } from "~/public/category/server/schema/CategorySchema";

export namespace CategoryInline {
	export interface Props extends Container.Props {
		category: CategorySchema.Type;
		textGroupProps?: Typo.PropsEx;
		textCategoryProps?: Typo.PropsEx;
	}
}

/**
 * Renders category data inline so it can fit dense UI rows without extra wrappers.
 * Use it where space is limited and category still needs to remain readable.
 */
export const CategoryInline: FC<CategoryInline.Props> = ({
	category,
	textGroupProps,
	textCategoryProps,
	...props
}) => {
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
};
