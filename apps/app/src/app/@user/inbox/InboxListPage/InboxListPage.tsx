import { translator } from "@use-pico/common/translator";
import type { tInboxQuery } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { BackHomeButton } from "~/app/@common/nav/BackHomeButton";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { InboxList } from "./InboxList/InboxList";

export namespace InboxListPage {
	export interface Props extends TitleContainer.Props {
		query: tInboxQuery;
	}
}

export const InboxListPage: FC<InboxListPage.Props> = ({ query, ...props }) => {
	return (
		<TitleContainer
			textTitle={translator.text("Inbox (title)")}
			left={<BackHomeButton />}
			right={<HomeMenuButton />}
			{...props}
		>
			<InboxList query={query} />
		</TitleContainer>
	);
};
