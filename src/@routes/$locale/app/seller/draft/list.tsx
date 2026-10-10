import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { DraftList } from "~/seller-draft/ui/DraftList/index";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/draft/list")({
	component() {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.textFn("Draft list (title)")}
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
