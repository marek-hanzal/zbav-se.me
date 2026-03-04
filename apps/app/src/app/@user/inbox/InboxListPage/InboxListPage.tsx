import { translator } from "@use-pico/common/translator";
import type { tInboxQuery } from "@zbav-se.me/sdk/api/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { InboxList } from "./InboxList/InboxList";

export namespace InboxListPage {
	export interface Props extends TitleContainer.Props {
		//
	}
}

export const InboxListPage: FC<InboxListPage.Props> = (props) => {
	const inboxQuery: tInboxQuery = {
		cursor: {
			page: 0,
			size: 1000,
		},
		sort: [
			{
				field: "timestamp",
				order: "desc",
			},
		],
	};

	return (
		<TitleContainer
			textTitle={translator.text("Inbox (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<InboxList
				query={{
					...inboxQuery,
				}}
			/>

			<InboxList
				query={{
					where: {
						archivedAtIsNull: false,
					},
					...inboxQuery,
				}}
				textEmpty={translator.text("No archived inbox items (message)")}
			/>
		</TitleContainer>
	);
};
