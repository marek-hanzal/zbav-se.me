import { Typo } from "@use-pico/client/ui/typo";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import type { FC } from "react";

export namespace CategoryInline {
	export interface Props {
		category: Pick<tCategory, "group" | "category">;
		textGroupProps?: Typo.PropsEx;
		textCategoryProps?: Typo.PropsEx;
	}
}

export const CategoryInline: FC<CategoryInline.Props> = ({ category, textGroupProps, textCategoryProps }) => {
	return (
		<div className={"flex flex-col gap-0.5 items-start"}>
			<Typo
				label={category.group}
				size={"xs"}
				{...textGroupProps}
			/>

			<Typo
				label={category.category}
				{...textCategoryProps}
			/>
		</div>
	);
};
