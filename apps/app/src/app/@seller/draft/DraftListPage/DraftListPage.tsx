import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { DraftList } from "./DraftList";

export namespace DraftListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the draft-list page with title framing and sorted draft collection rendering.
 * Use it as the route-level screen for browsing and continuing seller draft edits.
 *
 * @see apps/app/src/@routes
 */
export const DraftListPage: FC<DraftListPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Draft list (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<DraftList
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
