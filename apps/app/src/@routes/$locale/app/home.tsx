import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/user/home/~public/HomePage";

export const Route = createFileRoute("/$locale/app/home")({
	component: HomePage,
});
