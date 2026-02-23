import { createFileRoute } from "@tanstack/react-router";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionListingList } from "~/app/@seller-user/transaction-listing/ui/TransactionListingList";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/seller/message/list")({
	component() {
		return (
			<TitleContainer
				data-ui="SellerMessageList[TitleContainer]"
				textTitle={translator.text("Messages (title)")}
				right={<HomeMenuButton />}
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
			</TitleContainer>
		);
	},
});
