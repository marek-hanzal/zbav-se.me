import { createFileRoute } from "@tanstack/react-router";
import { SignInPage } from "~/client/@common/auth/~public/SignInPage";

export const Route = createFileRoute("/$locale/sign-in")({
	component: SignInPage,
});
