import { createFileRoute } from "@tanstack/react-router";
import { MessageListPage } from "~/app/@seller-user/transaction-listing/page/MessageListPage";

export const Route = createFileRoute("/$locale/seller/message/list")({
	component: MessageListPage,
});
