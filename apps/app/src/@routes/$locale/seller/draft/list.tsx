import { createFileRoute } from "@tanstack/react-router";
import { DraftListPage } from "~/app/@seller-user/draft/~public/DraftListPage";

export const Route = createFileRoute("/$locale/seller/draft/list")({
	component: DraftListPage,
});
