import { Typo } from "@use-pico/client/ui/typo";
import { type Cls, VariantProvider } from "@use-pico/cls";
import type { tCategory } from "@zbav-se.me/sdk/api/session";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC } from "react";

export namespace CategoryInline {
	export interface Props {
		category: Pick<tCategory, "group" | "category">;
		textGroupProps?: Typo.PropsEx;
		textCategoryProps?: Typo.PropsEx;
		tone?: Cls.VariantOf<ThemeCls, "tone">;
		theme?: Cls.VariantOf<ThemeCls, "theme">;
	}
}

export const CategoryInline: FC<CategoryInline.Props> = ({
	category,
	textGroupProps,
	textCategoryProps,
	tone,
	theme,
}) => {
	return (
		<VariantProvider
			cls={ThemeCls}
			variant={{
				tone,
				theme,
			}}
		>
			<div className={"flex flex-col gap-0.5 items-start"}>
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
						text: "lg",
						font: "bold",
					}}
					{...textCategoryProps}
				/>
			</div>
		</VariantProvider>
	);
};
