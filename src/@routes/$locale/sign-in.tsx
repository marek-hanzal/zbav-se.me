import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "~/common/auth/ui/SignInPage/SignInPage";

export const Route = createFileRoute("/$locale/sign-in")({
	component: SignInPage,
});
