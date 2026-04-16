import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { Agent } from "~/user/agent/ui/Agent";
import { TokenUsage } from "~/user/agent/ui/TokenUsage";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace AgentPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

export const AgentPage = withFallback<AgentPage.Props, TitleContainer>(
	(props) => {
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Agent (title)")}
				textSubtitle={<TokenUsage />}
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
				<Agent _suspense={"I know"} />
			</TitleContainer>
		);
	},
	(props) => {
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Agent (title)")}
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
