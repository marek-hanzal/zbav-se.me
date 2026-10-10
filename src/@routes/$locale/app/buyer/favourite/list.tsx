import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { FavouriteList } from "~/buyer-listing-favourite/ui/FavouriteList/index";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/favourite/list")({
	component() {
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
			>
				<Suspense fallback={<FavouriteList.Fallback />}>
					<FavouriteList _suspense={"I know"} />
				</Suspense>
			</TitleContainer>
		);
	},
});
