import { createFileRoute } from "@tanstack/react-router";
import { DraftListPage } from "~/app/@seller/draft/~public/DraftListPage";

export const Route = createFileRoute("/$locale/app/seller/draft/list")({
	component: DraftListPage,
});
