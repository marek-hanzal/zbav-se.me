import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/transaction/ui/buyer/TransactionList";

export const Route = createFileRoute("/$locale/ui/buyer/message/list")({
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
					}}
					ui={{
						inner: "default",
					}}
				/>
			</TitleContainer>
		);
	},
});
