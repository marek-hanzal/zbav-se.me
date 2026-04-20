import { createFileRoute } from "@tanstack/react-router";
import { AgentThreadPage } from "~/user/agent/ui/AgentThreadPage";

export const Route = createFileRoute("/$locale/app/agent/$threadId")({
	component() {
		const { threadId } = Route.useParams();

		return (
			<AgentThreadPage
				_suspense={"I know"}
				threadId={threadId}
			/>
		);
	},
	pendingComponent: AgentThreadPage.Fallback,
});
