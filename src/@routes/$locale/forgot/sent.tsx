import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordSentPage } from "~/user/auth/ui/ForgotPasswordSentPage";

export const Route = createFileRoute("/$locale/forgot/sent")({
	component: ForgotPasswordSentPage,
});
