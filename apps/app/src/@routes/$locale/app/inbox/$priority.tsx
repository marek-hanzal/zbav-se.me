import { createFileRoute } from "@tanstack/react-router";
import { InboxListPage } from "~/client/@user/inbox/~public/InboxListPage";
import { InboxPriorityEnumSchema } from "~/server/@user/inbox/enum/InboxPriorityEnumSchema";

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
