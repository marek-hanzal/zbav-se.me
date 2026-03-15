import { createFileRoute } from "@tanstack/react-router";
import { FeedListPage } from "~/app/@buyer/feed/~public/FeedListPage";

export const Route = createFileRoute("/$locale/buyer/feed/list")({
	component: FeedListPage,
});
