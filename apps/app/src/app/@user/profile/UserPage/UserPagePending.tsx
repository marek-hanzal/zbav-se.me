import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";

export namespace UserPagePending {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const UserPagePending: FC<UserPagePending.Props> = ({ ui, ...props }) => {
	return (
		<TitleContainer
			data-ui={"User[TitleContainer]"}
			textTitle={translator.text("User profile (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
				}}
			>
				<SpinnerContainer />
			</Container>
		</TitleContainer>
	);
};
