import { createFileRoute } from "@tanstack/react-router";
import { AgentWelcomePage } from "~/user/agent/ui/AgentWelcomePage";

export const Route = createFileRoute("/$locale/app/agent/welcome")({
	component() {
		return <AgentWelcomePage />;
	},
});
