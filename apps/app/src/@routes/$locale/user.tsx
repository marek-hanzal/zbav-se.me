import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "~/app/@user/profile/~public/UserPage";
import { UserPagePending } from "~/app/@user/profile/~public/UserPagePending";

export const Route = createFileRoute("/$locale/user")({
	component: UserPage,
	pendingComponent: UserPagePending,
});
