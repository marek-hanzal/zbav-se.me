import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ActivityPriorityEnumSchema } from "~/activity/schema/ActivityPriorityEnumSchema";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { ActivityList } from "~/user-activity/ui/ActivityList/index";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/activity/$priority")({
	component() {
		const { priority: rawPriority } = Route.useParams();

		const priority = ActivityPriorityEnumSchema.default("high")
			.catch("high")
			.parse(rawPriority);

		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Activity (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<Suspense fallback={<ActivityList.Fallback />}>
					<ActivityList
						_suspense={"I know"}
						priority={priority}
					/>
				</Suspense>
			</TitleContainer>
		);
	},
});
