import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "~/app/v0/@user/home/page/HomePage";

export const Route = createFileRoute("/$locale/home")({
	component: HomePage,
});
