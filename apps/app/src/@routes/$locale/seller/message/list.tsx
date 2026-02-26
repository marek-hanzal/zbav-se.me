import { createFileRoute } from "@tanstack/react-router";
import { MessageListPage } from "~/app/v0/@seller-user/transaction-listing/page/MessageListPage";

export const Route = createFileRoute("/$locale/seller/message/list")({
	component: MessageListPage,
});
