import { createLazyFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/transaction/ui/TransactionList";

export const Route = createLazyFileRoute("/$locale/ui/buyer/message/list")({
	component() {
		return (
			<TitleContainer textTitle={"Messages (title)"}>
				<TransactionList
					query={{
						sort: [
							{
								field: "status",
								direction: "asc",
							},
							{
								field: "createdAt",
								direction: "desc",
							},
						],
						meta: {
							side: "buyer",
						},
					}}
					ui={{
						inner: "default",
					}}
				/>
			</TitleContainer>
		)
	},
});
