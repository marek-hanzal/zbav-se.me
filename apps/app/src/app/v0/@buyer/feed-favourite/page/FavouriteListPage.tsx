import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { FavouriteListContainerSuspense } from "~/app/v0/@buyer/feed-favourite/ui/FavouriteListContainerSuspense";

export namespace FavouriteListPage {
	export interface Props extends TitleContainer.Props {}
}

export const FavouriteListPage: FC<FavouriteListPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Your favourites (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<FavouriteListContainerSuspense
				data-ui={"BuyerFavouriteList[FeedFavouriteList]"}
				query={{
					sort: [
						{
							field: "createdAt",
							order: "desc",
						},
					],
				}}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
