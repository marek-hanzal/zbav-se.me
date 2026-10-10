import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { FeedList } from "~/buyer/feed/ui/FeedList";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
