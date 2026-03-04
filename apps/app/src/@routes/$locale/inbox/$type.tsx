import { createFileRoute } from "@tanstack/react-router";
import { zInboxPriorityEnum } from "@zbav-se.me/sdk/api/user";
import { InboxListPage } from "~/app/@user/inbox/~public/InboxListPage";

export const Route = createFileRoute("/$locale/inbox/$type")({
	component() {
		const { type } = Route.useParams();
		const inboxType = zInboxPriorityEnum.default("high").catch("high").parse(type);

		return (
			<InboxListPage
				query={{
					where: {
						priority: inboxType,
						archivedAtIsNull: true,
					},
					cursor: {
						page: 0,
						size: 1000,
					},
					sort: [
						{
							field: "timestamp",
							order: "desc",
						},
					],
				}}
			/>
		);
	},
});
