import { createFileRoute } from "@tanstack/react-router";
import { FavouriteListPage } from "~/buyer/listing-favourite/ui/FavouriteListPage/FavouriteListPage";

export const Route = createFileRoute("/$locale/app/buyer/favourite/list")({
	component: FavouriteListPage,
});
