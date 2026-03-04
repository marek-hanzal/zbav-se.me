import { createFileRoute } from "@tanstack/react-router";
import { InboxListPage } from "~/app/@user/inbox/~public/InboxListPage";

export const Route = createFileRoute("/$locale/inbox/list")({
	component: InboxListPage,
});
