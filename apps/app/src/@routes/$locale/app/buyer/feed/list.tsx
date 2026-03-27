import { createFileRoute } from "@tanstack/react-router";
import { FeedListPage } from "~/@buyer/feed/~public/FeedListPage";

export const Route = createFileRoute("/$locale/app/buyer/feed/list")({
	component: FeedListPage,
});
