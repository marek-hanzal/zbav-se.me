import { createFileRoute } from "@tanstack/react-router";
import { UserPage } from "~/app/@user/profile/page/UserPage";

export const Route = createFileRoute("/$locale/user")({
	component: UserPage,
});
