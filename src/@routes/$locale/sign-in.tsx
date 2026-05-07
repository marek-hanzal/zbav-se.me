import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "~/user/auth/ui/SignInPage";

export const Route = createFileRoute("/$locale/sign-in")({
	component: SignInPage,
});
