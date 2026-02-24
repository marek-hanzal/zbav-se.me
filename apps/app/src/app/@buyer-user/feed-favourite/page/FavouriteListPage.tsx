import { useLocale } from "@use-pico/client/hook";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { FavouriteListContainer } from "~/app/@buyer-user/feed-favourite/ui/FavouriteListContainer";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace FavouriteListPage {
	export interface Props extends TitleContainer.Props {}
}

export const FavouriteListPage: FC<FavouriteListPage.Props> = ({ children, ui, ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Your favourites (title)")}
			right={<HomeMenuButton />}
			ui={ui}
			{...props}
		>
			<FavouriteListContainer
				data-ui={"BuyerFavouriteList[FeedFavouriteList]"}
				query={{
					sort: [
						{
							field: "createdAt",
							order: "desc",
						},
					],
				}}
				linkTo={{
					header: ({ feedId, children }) => (
						<LinkTo
							data-ui={"BuyerFavouriteList-[LinkTo.header]"}
							to={"/$locale/flow/buyer/feed/$id/favourite/list"}
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
				ui={{
					inner: "default",
				}}
			/>

			{children}
		</TitleContainer>
	);
};
