import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "~/user/profile/UserPage/UserPage";
import { UserPagePending } from "~/user/profile/UserPage/UserPagePending";

export const Route = createFileRoute("/$locale/app/user")({
	component: UserPage,
	pendingComponent: UserPagePending,
});
