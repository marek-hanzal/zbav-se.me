import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace UserPendingPage {
	export interface Props extends TitleContainer.Props {}
}

export const UserPendingPage: FC<UserPendingPage.Props> = ({ children, ui, ...props }) => {
	return (
		<TitleContainer
			data-ui={"User[TitleContainer]"}
			textTitle={translator.text("User profile (title)")}
			right={<HomeMenuButton />}
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			{...props}
		>
			<SpinnerContainer />

			{children}
		</TitleContainer>
	);
};
