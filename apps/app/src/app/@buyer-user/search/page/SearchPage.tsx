import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace SearchPage {
	export interface Props extends TitleContainer.Props {}
}

/**
 * Composes the route-level search screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the search journey.
 *
 * @see apps/app/src/@routes
 */
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
