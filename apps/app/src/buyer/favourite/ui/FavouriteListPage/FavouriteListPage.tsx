import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
import { FavouriteList } from "./FavouriteList";

export namespace FavouriteListPage {
	export interface Props extends TitleContainer.Props {}
}

export const FavouriteListPage: FC<FavouriteListPage.Props> = (props) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Your favourites (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<FavouriteList.Fallback />}>
				<FavouriteList _suspense={"I know"} />
			</Suspense>
		</TitleContainer>
	);
};
