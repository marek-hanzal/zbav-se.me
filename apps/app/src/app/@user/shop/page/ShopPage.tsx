import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace ShopPage {
	export interface Props extends TitleContainer.Props {}
}

export const ShopPage: FC<ShopPage.Props> = ({ children, ui, ...props }) => {
	return (
		<TitleContainer
			textTitle={translator.text("Shop (title)")}
			right={<HomeMenuButton />}
			ui={ui}
			{...props}
		>
			Shop
			{children}
		</TitleContainer>
	);
};
