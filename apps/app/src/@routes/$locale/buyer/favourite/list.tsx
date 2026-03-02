import { createFileRoute } from "@tanstack/react-router";
import { FavouriteListPage } from "~/app/v0/@buyer/feed-favourite/page/FavouriteListPage";

export const Route = createFileRoute("/$locale/buyer/favourite/list")({
	component: FavouriteListPage,
});
