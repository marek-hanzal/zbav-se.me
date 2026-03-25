import { createFileRoute } from "@tanstack/react-router";
import { zInboxPriorityEnum } from "@zbav-se.me/sdk/api/user";
import { InboxListPage } from "~/client/@user/inbox/~public/InboxListPage";

export const Route = createFileRoute("/$locale/app/inbox/$priority")({
	component() {
		const { priority } = Route.useParams();

		return (
			<InboxListPage
				priority={zInboxPriorityEnum.default("high").catch("high").parse(priority)}
			/>
		);
	},
});
