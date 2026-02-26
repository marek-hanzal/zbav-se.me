import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenu } from "~/app/v0/@user/home/HomeMenu";

export namespace HomePage {
	export interface Props extends TitleContainer.Props {}
}

export const HomePage: FC<HomePage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("zbav-se.me")}
			{...props}
		>
			<HomeMenu />
		</TitleContainer>
	);
};
