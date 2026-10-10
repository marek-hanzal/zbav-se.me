import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { ListingList } from "~/seller-listing/ui/ListingList/index";
import { useTranslator } from "~/translation/hook/useTranslator";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/listing/my")({
	component() {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.textFn("My listings (title)")}
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
				<Suspense fallback={<ListingList.Fallback />}>
					<ListingList _suspense={"I know"} />
				</Suspense>
			</TitleContainer>
		);
	},
});
