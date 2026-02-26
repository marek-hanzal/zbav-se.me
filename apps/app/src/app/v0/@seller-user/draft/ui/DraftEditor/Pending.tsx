import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace Pending {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const Pending: FC<Pending.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Draft edit (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<SpinnerContainer />
		</TitleContainer>
	);
};
