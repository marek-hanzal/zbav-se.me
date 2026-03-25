import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "~/client/@user/welcome/~public/WelcomePage";

export const Route = createFileRoute("/$locale/app/welcome")({
	component: WelcomePage,
});
