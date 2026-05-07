import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "~/user/welcome/WelcomePage/WelcomePage";

export const Route = createFileRoute("/$locale/app/welcome")({
	component: WelcomePage,
});
