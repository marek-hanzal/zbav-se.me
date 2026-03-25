import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/client/@user/home/~public/HomePage";

export const Route = createFileRoute("/$locale/app/home")({
	component: HomePage,
});
