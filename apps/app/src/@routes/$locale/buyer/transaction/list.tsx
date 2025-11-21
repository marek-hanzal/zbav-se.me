import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/@buyer/listing-transaction/ui/TransactionList";

export const Route = createFileRoute("/$locale/buyer/transaction/list")({
	pendingComponent() {
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
					/>
				}
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
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
					/>
				}
			>
				<TransactionList />
			</TitleContainer>
		);
	},
});
