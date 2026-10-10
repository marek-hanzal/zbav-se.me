import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { FeedList } from "~/buyer-feed/ui/FeedList/index";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/feed/list")({
	component() {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"FeedList[TitleContainer]"}
				textTitle={translator.text("Feed select (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				data-ui-layout="vertical-header-content"
				right={<HomeMenuButton />}
			>
				<Suspense fallback={<FeedList.Fallback />}>
					<FeedList _suspense={"I know"} />
				</Suspense>
			</TitleContainer>
		);
	},
});
