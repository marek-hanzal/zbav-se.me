import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { DraftList } from "~/seller/draft/ui/DraftList";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/draft/list")({
	component() {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Draft list (title)")}
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
				<Suspense fallback={<SpinnerContainer />}>
					<DraftList
						_suspense={"I know"}
						data-ui-inner="default"
					/>
				</Suspense>
			</TitleContainer>
		);
	},
});
