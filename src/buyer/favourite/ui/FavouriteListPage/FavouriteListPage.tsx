import { type FC, Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { FavouriteList } from "./FavouriteList";

export namespace FavouriteListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const FavouriteListPage: FC<FavouriteListPage.Props> = (props) => {
	const translator = useTranslator();
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
