import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { FEED_LIMIT } from "~/app/@common/limit/Limit";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { FeedList } from "./FeedList";

export namespace FeedListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the feed-list page with title, navigation action, and feed list query defaults.
 * Use it as the route-level screen for browsing and managing buyer feed presets.
 *
 * @see apps/app/src/@routes
 */
export const FeedListPage: FC<FeedListPage.Props> = ({ ui, ...props }) => {
	return (
		<TitleContainer
			data-ui={"FeedList[TitleContainer]"}
			textTitle={translator.text("Feed select (title)")}
			left={<BackHomeButton />}
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			right={<HomeMenuButton />}
			{...props}
		>
			<FeedList
				data-ui={"FeedList-[FeedList]"}
				limit={FEED_LIMIT}
			/>
		</TitleContainer>
	);
};
