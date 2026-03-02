import { createFileRoute } from "@tanstack/react-router";
import { MessageListPage } from "~/app/v0/@buyer/transaction/page/MessageListPage";

export const Route = createFileRoute("/$locale/buyer/message/list")({
	component: MessageListPage,
});
