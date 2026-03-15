import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { FavouriteList } from "./FavouriteList";

export namespace FavouriteListPage {
	export interface Props extends TitleContainer.Props {}
}

export const FavouriteListPage: FC<FavouriteListPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Your favourites (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<FavouriteList.Fallback />}>
				<FavouriteList _suspense={"I know"} />
			</Suspense>
		</TitleContainer>
	);
};
