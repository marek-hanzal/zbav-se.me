import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenu } from "../HomeMenu/HomeMenu";

export namespace HomePage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the route-level home screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the home journey.
 *
 * @see apps/app/src/app/@user/home/page/HomePage.tsx
 */
export const HomePage: FC<HomePage.Props> = (props) => {
	return (
		<TitleContainer
			data-ui={"HomePage"}
			textTitle={translator.text("zbav-se.me")}
			{...props}
		>
			<HomeMenu />
		</TitleContainer>
	);
};
