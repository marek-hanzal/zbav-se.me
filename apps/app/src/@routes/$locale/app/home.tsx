import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/app/@user/home/~public/HomePage";

export const Route = createFileRoute("/$locale/app/home")({
	component: HomePage,
});
