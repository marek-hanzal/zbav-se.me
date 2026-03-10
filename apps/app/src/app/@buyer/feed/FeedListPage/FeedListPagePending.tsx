import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace FeedListPagePending {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const FeedListPagePending: FC<FeedListPagePending.Props> = ({ ui, ...props }) => {
	return (
		<TitleContainer
			data-ui={"FeedListPending[TitleContainer]"}
			textTitle={translator.text("Feed select (title)")}
			left={<BackHomeButton />}
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
