import { createFileRoute } from "@tanstack/react-router";
import { ChatPage } from "~/user/chat/ui/ChatPage";

export const Route = createFileRoute("/$locale/app/chat")({
	component: ChatPage,
});
