import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { useLocale } from "~/locale/hook/useLocale";
import { DraftList } from "~/seller/draft/ui/DraftList";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
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
