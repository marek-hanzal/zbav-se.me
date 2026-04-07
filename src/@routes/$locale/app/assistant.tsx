import { createFileRoute } from "@tanstack/react-router";
import { AssistantPage } from "~/user/assistant-chat/ui/AssistantPage";

export const Route = createFileRoute("/$locale/app/assistant")({
	component() {
		return <AssistantPage _suspense={"I know"} />;
	},
	pendingComponent: AssistantPage.Fallback,
});
