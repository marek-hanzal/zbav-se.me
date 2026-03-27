import { createFileRoute } from "@tanstack/react-router";
import { WelcomePage } from "~/@user/welcome/~public/WelcomePage";

export const Route = createFileRoute("/$locale/app/welcome")({
	component: WelcomePage,
});
