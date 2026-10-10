import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { FavouriteList } from "~/buyer/listing-favourite/ui/FavouriteList";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
