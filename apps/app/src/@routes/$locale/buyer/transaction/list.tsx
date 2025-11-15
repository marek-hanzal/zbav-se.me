import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/listing-transaction/TransactionList";

export const Route = createFileRoute("/$locale/buyer/transaction/list")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Transactions (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				<TransactionList side={"buyer"} />
			</TitleContainer>
		);
	},
});
