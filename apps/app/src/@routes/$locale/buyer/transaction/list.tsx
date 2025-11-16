import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { SpinnerContainer, TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/listing-transaction/ui/TransactionList";

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
						tone={"secondary"}
					/>
				}
			>
				<SpinnerContainer disableOverlay />
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
						tone={"secondary"}
					/>
				}
			>
				<TransactionList side={"buyer"} />
			</TitleContainer>
		);
	},
});
