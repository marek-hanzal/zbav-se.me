import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { TransactionList } from "~/app/v0/@buyer-user/transaction/ui/TransactionList";
import { HomeMenuButton } from "~/app/v0/@user/home/HomeMenuButton";

export namespace MessageListPage {
	export interface Props extends TitleContainer.Props {}
}

export const MessageListPage: FC<MessageListPage.Props> = (props) => {
	return (
		<TitleContainer
			textTitle={translator.text("Messages (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<TransactionList
				query={{
					sort: [
						{
							field: "status",
							order: "asc",
						},
						{
							field: "createdAt",
							order: "desc",
						},
					],
				}}
				ui={{
					inner: "default",
				}}
			/>
		</TitleContainer>
	);
};
