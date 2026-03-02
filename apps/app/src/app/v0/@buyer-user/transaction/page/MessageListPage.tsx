import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionList } from "~/app/v0/@buyer-user/transaction/ui/TransactionList";

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
