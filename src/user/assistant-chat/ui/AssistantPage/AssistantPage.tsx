import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { AssistantChat } from "~/user/assistant-chat/ui/AssistantChat";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace AssistantPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

export const AssistantPage = withFallback<AssistantPage.Props, TitleContainer>(
	(props) => {
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Assistant (title)")}
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
				<AssistantChat _suspense={"I know"} />
			</TitleContainer>
		);
	},
	(props) => {
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Assistant (title)")}
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
				<SpinnerContainer />
			</TitleContainer>
		);
	},
);
