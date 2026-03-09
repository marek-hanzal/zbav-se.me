import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace SearchPagePending {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const SearchPagePending: FC<SearchPagePending.Props> = ({ ui, ...props }) => {
	return (
		<TitleContainer
			data-ui={"SearchPagePending[TitleContainer]"}
			textTitle={translator.text("Search (title)")}
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			right={<HomeMenuButton />}
			{...props}
		>
			<SpinnerContainer />
		</TitleContainer>
	);
};
