import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { Agent } from "~/user/agent/ui/Agent";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
