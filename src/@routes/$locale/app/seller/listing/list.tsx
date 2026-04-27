import { createFileRoute } from "@tanstack/react-router";
import { DraftListPage } from "~/seller/draft/ui/DraftListPage/DraftListPage";

export const Route = createFileRoute("/$locale/app/seller/listing/list")({
	component: DraftListPage,
});
