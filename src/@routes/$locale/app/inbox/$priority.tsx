import { createFileRoute } from "@tanstack/react-router";
import { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import { InboxListPage } from "~/user/inbox/ui/InboxListPage/InboxListPage";

export const Route = createFileRoute("/$locale/app/inbox/$priority")({
	component() {
		const { priority } = Route.useParams();

		return (
			<InboxListPage
				priority={InboxPriorityEnumSchema.default("high").catch("high").parse(priority)}
			/>
		);
	},
});
