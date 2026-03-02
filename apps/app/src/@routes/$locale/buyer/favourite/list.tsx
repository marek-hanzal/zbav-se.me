import { createFileRoute } from "@tanstack/react-router";
import { FavouriteListPage } from "~/app/@buyer/favourite/~public/FavouriteListPage";

export const Route = createFileRoute("/$locale/buyer/favourite/list")({
	component: FavouriteListPage,
});
