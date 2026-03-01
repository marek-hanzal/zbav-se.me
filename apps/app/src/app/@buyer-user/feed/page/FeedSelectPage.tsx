import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { FeedListContainer } from "~/app/@buyer-user/feed/ui/FeedListContainer";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace FeedSelectPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

/**
 * Composes the feed-selection page with title, navigation action, and feed list query defaults.
 * Use it as the route-level screen for choosing and managing buyer feed presets.
 *
 * @see apps/app/src/@routes
 */
export const FeedSelectPage: FC<FeedSelectPage.Props> = ({ ui, ...props }) => {
	const feedCountLimit = 3;

	return (
		<TitleContainer
			data-ui={"FeedSelect[TitleContainer]"}
			textTitle={translator.text("Feed select (title)")}
			ui={{
				layout: "vertical-header-content",
				...ui,
			}}
			right={<HomeMenuButton />}
			{...props}
		>
			<FeedListContainer
				data-ui={"FeedSelect-[FeedListContainer]"}
				query={{
					sort: [
						{
							field: "createdAt",
							order: "desc",
						},
					],
				}}
				limit={feedCountLimit}
			/>
		</TitleContainer>
	);
};
