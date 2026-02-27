import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { withCategoryQuery } from "@zbav-se.me/sdk/query/session";
import type { FC } from "react";

export namespace Data {
	export interface Props extends Container.Props {
		categoryId: string;
		textGroupProps?: Typo.PropsEx;
		textCategoryProps?: Typo.PropsEx;
	}
}

export const Data: FC<Data.Props> = ({
	ui,
	categoryId,
	textGroupProps,
	textCategoryProps,
	...props
}) => {
	const { data: category } = withCategoryQuery.useFetchQuery(categoryId);

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
};
