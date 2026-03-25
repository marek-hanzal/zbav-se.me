import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "~/client/@user/profile/~public/UserPage";
import { UserPagePending } from "~/client/@user/profile/~public/UserPagePending";

export const Route = createFileRoute("/$locale/app/user")({
	component: UserPage,
	pendingComponent: UserPagePending,
});
