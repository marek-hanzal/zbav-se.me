import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "~/user/profile/~public/UserPage";
import { UserPagePending } from "~/user/profile/~public/UserPagePending";

export const Route = createFileRoute("/$locale/app/user")({
	component: UserPage,
	pendingComponent: UserPagePending,
});
