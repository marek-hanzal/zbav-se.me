import { createFileRoute } from "@tanstack/react-router";
import { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import { ActivityListPage } from "~/user/activity/ui/ActivityListPage/ActivityListPage";

export const Route = createFileRoute("/$locale/app/activity/$priority")({
	component() {
		const { priority } = Route.useParams();

		return (
			<ActivityListPage
				priority={ActivityPriorityEnumSchema.default("high").catch("high").parse(priority)}
			/>
		);
	},
});
