import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { EpilogBadge } from "~/app/@buyer/listing-transaction/ui/EpilogBadge";
import { TransactionLogList } from "~/app/@buyer/listing-transaction-log/ui/TransactionLogList";

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
		const listingTransactionFetchQuery = withListingTransactionFetchQuery.useSuspenseQuery(
			{
				where: {
					id,
				},
				meta: {
					side: "buyer",
				},
			},
			{
				refetchInterval: 10_000,
			},
		);
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
				<Container
					ui={"Buyer-TransactionDetail-root"}
					gap={"lg"}
				>
					<TransactionLogList
						query={{
							where: {
								listingTransactionId: id,
							},
							sort: [
								{
									field: "createdAt",
									direction: "asc",
								},
							],
						}}
					/>

					<EpilogBadge listingTransaction={listingTransaction} />
				</Container>
			</TitleContainer>
		);
	},
});
