import { createFileRoute } from "@tanstack/react-router";
import { DraftListPage } from "~/app/@seller-user/draft/page/DraftListPage";
import { DraftListPendingPage } from "~/app/@seller-user/draft/page/DraftListPendingPage";

export const Route = createFileRoute("/$locale/seller/draft/list")({
	component: DraftListPage,
	pendingComponent: DraftListPendingPage,
});
