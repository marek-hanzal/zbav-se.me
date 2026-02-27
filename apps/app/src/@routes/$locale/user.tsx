import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "~/app/@user/profile/page/UserPage";
import { UserPendingPage } from "~/app/@user/profile/page/UserPendingPage";

export const Route = createFileRoute("/$locale/user")({
	pendingComponent: UserPendingPage,
	component: UserPage,
});
