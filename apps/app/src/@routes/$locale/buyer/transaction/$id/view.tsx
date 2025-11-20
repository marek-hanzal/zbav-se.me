import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { SpinnerContainer, TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionLogList } from "~/app/listing-transaction-log/ui/TransactionLogList";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/view")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Transaction detail (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/transaction/list"}
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
		const { locale, id } = Route.useParams();
		const listingTransactionFetchQuery = withListingTransactionFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
			meta: {
				side: "buyer",
			},
		});
		const listingTransaction = listingTransactionFetchQuery.data;

		return (
			<TitleContainer
				textTitle={"Transaction detail (title)"}
				textSubtitle={listingTransaction.title}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/transaction/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<Container>
					<TransactionLogList
						side={"buyer"}
						query={{
							where: {
								listingTransactionId: id,
							},
							sort: [
								{
									field: "createdAt",
									direction: "desc",
								},
							],
						}}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
