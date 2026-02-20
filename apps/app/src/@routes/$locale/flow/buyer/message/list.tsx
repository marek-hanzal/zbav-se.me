import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/@buyer-user/transaction/ui/TransactionList";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/buyer/message/list")({
	component() {
		return (
			<TitleContainer
				textTitle={"Messages (title)"}
				right={<HomeMenuButton />}
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
	},
});
