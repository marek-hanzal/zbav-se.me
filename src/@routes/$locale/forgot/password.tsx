import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "~/user/auth/ui/ForgotPasswordPage";

export const Route = createFileRoute("/$locale/forgot/password")({
	component: ForgotPasswordPage,
});
