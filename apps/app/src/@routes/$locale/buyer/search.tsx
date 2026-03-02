import { createFileRoute } from "@tanstack/react-router";
import { SearchPage } from "~/app/@buyer-user/search/~public/SearchPage";

export const Route = createFileRoute("/$locale/buyer/search")({
	component: SearchPage,
});
