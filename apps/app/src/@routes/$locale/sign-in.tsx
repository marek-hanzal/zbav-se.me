import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "~/common/auth/~public/SignInPage";

export const Route = createFileRoute("/$locale/sign-in")({
	component: SignInPage,
});
