import { useLocale } from "@use-pico/client/hook";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import type { InboxPriorityEnumSchema } from "~/common/inbox/enum/InboxPriorityEnumSchema";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { HomeMenuButton } from "~/user/home/~public/HomeMenuButton";
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
