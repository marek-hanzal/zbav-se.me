import { type FC, Suspense } from "react";
import { useLocale } from "@/lib/client/locale";
import { translator } from "@/lib/common/translator";
import type { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { InboxList } from "./InboxList";

export namespace InboxListPage {
	export interface Props extends TitleContainer.Props {
		priority: InboxPriorityEnumSchema.Type;
	}
}

export const InboxListPage: FC<InboxListPage.Props> = ({ priority, ...props }) => {
	const locale = useLocale();

	return (
		<TitleContainer
			textTitle={translator.text("Inbox (title)")}
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
			<Suspense fallback={<InboxList.Fallback />}>
				<InboxList
					_suspense={"I know"}
					priority={priority}
				/>
			</Suspense>
		</TitleContainer>
	);
};
