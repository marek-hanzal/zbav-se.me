import { withFallback } from "@/lib/client/fallback";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { Agent } from "~/user/agent/ui/Agent";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export namespace AgentThreadPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		threadId: string;
	}
}

export const AgentThreadPage = withFallback<AgentThreadPage.Props, TitleContainer>(
	({ threadId, ...props }) => {
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Agent (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/agent/welcome"
						params={{
							locale,
						}}
						title={translator.text("Back to agent welcome page (aria)")}
					/>
				}
				right={<HomeMenuButton />}
				{...props}
			>
				<Agent
					_suspense={"I know"}
					threadId={threadId}
				/>
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
						to="/$locale/app/agent/welcome"
						params={{
							locale,
						}}
						title={translator.text("Back to agent welcome page (aria)")}
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
