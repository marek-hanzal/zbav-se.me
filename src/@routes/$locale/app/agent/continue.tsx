import { createFileRoute, redirect } from "@tanstack/react-router";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { withAgentThreadQuery } from "~/user/agent/query/withAgentThreadQuery";
import { Agent } from "~/user/agent/ui/Agent";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/agent/continue")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const [thread] = await withAgentThreadQuery.ensureCollectionQuery(queryClient, {
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
