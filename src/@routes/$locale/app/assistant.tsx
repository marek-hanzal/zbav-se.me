import { createFileRoute } from "@tanstack/react-router";
import { AssistantPage } from "~/user/chat/ui/AssistantPage";

export const Route = createFileRoute("/$locale/app/assistant")({
	component: AssistantPage,
});
