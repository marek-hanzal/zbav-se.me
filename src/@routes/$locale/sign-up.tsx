import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "~/common/auth/~public/SignUpPage";

export const Route = createFileRoute("/$locale/sign-up")({
	component: SignUpPage,
});
