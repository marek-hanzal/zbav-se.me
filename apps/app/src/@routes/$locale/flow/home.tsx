import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/app/@user/home/page/HomePage";

export const Route = createFileRoute("/$locale/flow/home")({
	component: HomePage,
});
