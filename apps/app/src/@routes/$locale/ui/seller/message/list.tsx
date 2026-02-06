import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionListingList } from "~/app/@seller-user/transaction-listing/ui/TransactionListingList";

export const Route = createFileRoute("/$locale/ui/seller/message/list")({
	component() {
		return (
			<TitleContainer
				data-ui="/seller/message/list[TitleContainer]"
				textTitle={"Messages (title)"}
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
