import { createFileRoute, redirect } from "@tanstack/react-router";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { withAgentThreadQuery } from "~/user-agent/query/withAgentThreadQuery";
import { Agent } from "~/user-agent/ui/Agent/index";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/agent/continue")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const [thread] = await withAgentThreadQuery.ensureCollectionQueryFn(queryClient, {
			where: {
				archivedAt: "active",
			},
			sort: [
				{
					field: "updatedAt",
					order: "desc",
				},
			],
			cursor: {
				page: 0,
				size: 1,
			},
			limit: 1,
		});

		if (!thread) {
			throw redirect({
				to: "/$locale/app/agent/welcome",
				params: {
					locale,
				},
			});
		}

		throw redirect({
			to: "/$locale/app/agent/$threadId",
			params: {
				locale,
				threadId: thread.id,
			},
		});
	},
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.textFn("Agent (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/agent/welcome"
						params={{
							locale,
						}}
						title={translator.textFn("Back to agent welcome page (aria)")}
					/>
				}
				right={<HomeMenuButton />}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
});
