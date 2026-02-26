import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace SearchPage {
	export interface Props extends TitleContainer.Props {}
}

export const SearchPage: FC<SearchPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Search (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			Search Here
		</TitleContainer>
	);
};
