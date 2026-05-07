import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "~/user/profile/UserPage";
import { UserPagePending } from "~/user/profile/UserPage/UserPagePending";

export const Route = createFileRoute("/$locale/app/user")({
	component() {
		return <UserPage _suspense={"I know"} />;
	},
	pendingComponent: UserPagePending,
});
