import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { useLocale } from "~/locale/hook/useLocale";
import { ListingList } from "~/seller/listing/ui/ListingList";
import { useTranslator } from "~/translation/hook/useTranslator";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/listing/my")({
	component() {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("My listings (title)")}
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
