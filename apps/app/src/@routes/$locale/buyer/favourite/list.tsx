import { createFileRoute } from "@tanstack/react-router";
import { FavouriteListPage } from "~/app/@buyer-user/feed-favourite/page/FavouriteListPage";

export const Route = createFileRoute("/$locale/buyer/favourite/list")({
	component: FavouriteListPage,
});
