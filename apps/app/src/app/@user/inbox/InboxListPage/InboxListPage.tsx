import { translator } from "@use-pico/common/translator";
import type { zInboxPriorityEnum } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { InboxList } from "./InboxList";

export namespace InboxListPage {
	export interface Props extends TitleContainer.Props {
		priority: zInboxPriorityEnum;
	}
}

export const InboxListPage: FC<InboxListPage.Props> = ({ priority, ...props }) => {
	return (
		<TitleContainer
			textTitle={translator.text("Inbox (title)")}
			left={<BackHomeButton />}
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
