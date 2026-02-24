import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { TransactionListingList } from "~/app/@seller-user/transaction-listing/ui/TransactionListingList";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export namespace MessageListPage {
	export interface Props extends TitleContainer.Props {}
}

export const MessageListPage: FC<MessageListPage.Props> = ({ children, ui, ...props }) => {
	return (
		<TitleContainer
			data-ui="SellerMessageList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			right={<HomeMenuButton />}
			ui={ui}
			{...props}
		>
			<TransactionListingList
				query={{
					sort: [
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

			{children}
		</TitleContainer>
	);
};
