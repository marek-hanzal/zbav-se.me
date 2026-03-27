import { createFileRoute } from "@tanstack/react-router";
import { InboxListPage } from "~/@user/inbox/~public/InboxListPage";
import { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";

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
