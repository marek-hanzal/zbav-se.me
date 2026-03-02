import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "~/app/@user/welcome/~public/WelcomePage";

export const Route = createFileRoute("/$locale/welcome")({
	component: WelcomePage,
});
