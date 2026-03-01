import { useLocale } from "@use-pico/client/hook";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";
import { FeedListContainer } from "~/app/v0/@buyer-user/feed/ui/FeedListContainer";

export namespace FeedSelectPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const FeedSelectPage: FC<FeedSelectPage.Props> = ({ ui, ...props }) => {
	const locale = useLocale();
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
				tools={[
					"setup",
				]}
				linkTo={{
					header: ({ feedId, children }) => (
						<LinkTo
							data-ui={"FeedSelect-[LinkTo.header]"}
							to={"/$locale/buyer/feed/$id/list"}
							params={{
								locale,
								id: feedId,
							}}
							ui={{
								display: "block",
								height: "full",
							}}
						>
							{children}
						</LinkTo>
					),
				}}
			/>
		</TitleContainer>
	);
};
