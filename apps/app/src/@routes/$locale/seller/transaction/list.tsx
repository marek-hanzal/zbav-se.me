import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { SpinnerContainer, TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/listing-transaction/ui/TransactionList";

export const Route = createFileRoute("/$locale/seller/transaction/list")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				ui="TransactionList-root"
				textTitle={"Transactions (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller"}
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
				ui="TransactionList-root"
				textTitle={"Transactions (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					/>
				}
			>
				<TransactionList side={"seller"} />
			</TitleContainer>
		);
	},
});
