import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, Suspense } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { TransactionListingList } from "~/app/v0/@seller-user/transaction-listing/ui/TransactionListingList";
import { TransactionListingListPending } from "~/app/v0/@seller-user/transaction-listing/ui/TransactionListingListPending";

export namespace MessageListPage {
	export interface Props extends TitleContainer.Props {}
}

export const MessageListPage: FC<MessageListPage.Props> = (props) => {
	return (
		<TitleContainer
			data-ui="SellerMessageList[TitleContainer]"
			textTitle={translator.text("Messages (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<Suspense fallback={<TransactionListingListPending />}>
				<TransactionListingList
					_suspense={"I know"}
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
			</Suspense>
		</TitleContainer>
	);
};
