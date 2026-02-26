import { createFileRoute } from "@tanstack/react-router";
import { MessageListPage } from "~/app/@buyer-user/transaction/page/MessageListPage";

export const Route = createFileRoute("/$locale/buyer/message/list")({
	component: MessageListPage,
});
