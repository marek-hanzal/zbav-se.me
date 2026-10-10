import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { Agent } from "~/user-agent/ui/Agent/index";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/agent/$threadId")({
	component() {
		const { threadId } = Route.useParams();

		const translator = useTranslator();
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
			>
				<Agent
					_suspense={"I know"}
					threadId={threadId}
				/>
			</TitleContainer>
		);
	},
	pendingComponent: () => {
		const translator = useTranslator();
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
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
});
