import { createFileRoute } from "@tanstack/react-router";
import { SignUpPage } from "~/common/auth/ui/SignUpPage/SignUpPage";

export const Route = createFileRoute("/$locale/sign-up")({
	component: SignUpPage,
});
