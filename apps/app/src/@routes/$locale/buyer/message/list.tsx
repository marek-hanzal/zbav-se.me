import { createFileRoute } from "@tanstack/react-router";
import { MessageListPage } from "~/app/@buyer/transaction/~public/MessageListPage";

export const Route = createFileRoute("/$locale/buyer/message/list")({
	component: MessageListPage,
});
