import { createFileRoute } from "@tanstack/react-router";
import { MagicLinkSentPage } from "~/user/auth/ui/MagicLinkSentPage";

export const Route = createFileRoute("/$locale/sign-in/magic")({
	component: MagicLinkSentPage,
});
