import { createFileRoute } from "@tanstack/react-router";
import { AgentPage } from "~/user/agent/ui/AgentPage";

export const Route = createFileRoute("/$locale/app/agent")({
	component() {
		return <AgentPage _suspense={"I know"} />;
	},
	pendingComponent: AgentPage.Fallback,
});
