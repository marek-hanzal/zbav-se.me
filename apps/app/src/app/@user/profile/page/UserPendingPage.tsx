import { SpinnerContainer } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace UserPendingPage {
	export interface Props extends TitleContainer.Props {}
}

/**
 * Composes the route-level user pending screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the user pending journey.
 *
 * @see apps/app/src/@routes
 */
export const UserPendingPage: FC<UserPendingPage.Props> = ({ ui, ...props }) => {
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
		</TitleContainer>
	);
};
