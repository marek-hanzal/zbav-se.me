import { createFileRoute } from "@tanstack/react-router";
import { DraftListPage } from "~/seller/draft/ui/DraftListPage";

export const Route = createFileRoute("/$locale/app/seller/draft/list")({
	component: DraftListPage,
});
