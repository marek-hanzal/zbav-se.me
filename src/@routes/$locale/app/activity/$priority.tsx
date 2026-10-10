import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { ActivityList } from "~/user/activity/ui/ActivityList";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
