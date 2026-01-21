import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";

export namespace CategoryInline {
	export interface Props extends Container.Props {
		category: Pick<tCategory, "group" | "category">;
		textGroupProps?: Typo.PropsEx;
		textCategoryProps?: Typo.PropsEx;
	}
}

export const CategoryInline: FC<CategoryInline.Props> = ({
	category,
	textGroupProps,
	textCategoryProps,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui="CategoryInline[Container]"
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
					text: "xs",
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
};
