import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/transaction/ui/TransactionList";

export const Route = createFileRoute("/$locale/ui/buyer/message/list")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer textTitle={"Messages (title)"}>
				<TransactionList
					locale={locale}
					query={{
						sort: [
							{
								field: "updatedAt",
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
