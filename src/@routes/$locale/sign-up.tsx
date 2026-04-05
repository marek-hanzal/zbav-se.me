import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "~/user/auth/ui/SignUpPage";

export const Route = createFileRoute("/$locale/sign-up")({
	component: SignUpPage,
});
