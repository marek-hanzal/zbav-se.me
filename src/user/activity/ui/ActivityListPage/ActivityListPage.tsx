import { type FC, Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { ActivityPriorityEnumSchema } from "~/common/activity/enum/ActivityPriorityEnumSchema";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { ActivityList } from "./ActivityList";

export namespace ActivityListPage {
	export interface Props extends TitleContainer.Props {
		priority: ActivityPriorityEnumSchema.Type;
	}
}

export const ActivityListPage: FC<ActivityListPage.Props> = ({ priority, ...props }) => {
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
			{...props}
		>
			<Suspense fallback={<ActivityList.Fallback />}>
				<ActivityList
					_suspense={"I know"}
					priority={priority}
				/>
			</Suspense>
		</TitleContainer>
	);
};
