import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "~/app/@buyer/search/~public/SearchPage";

export const Route = createFileRoute("/$locale/buyer/search")({
	component: SearchPage,
});
