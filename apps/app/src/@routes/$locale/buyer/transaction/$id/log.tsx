import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { EpilogBadge, SellerInfoContainer } from "@zbav-se.me/buyer/listing-transaction";
import { TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { BuyerInfoContainer } from "@zbav-se.me/seller/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/log")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				ui="TransactionView-root"
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
					ui={"Buyer-TransactionLog-root"}
					gap={"lg"}
				>
					<TransactionLogList
						locale={locale}
						side="buyer"
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
						SellerInfo={SellerInfoContainer}
						BuyerInfo={BuyerInfoContainer}
					/>

					<EpilogBadge listingTransaction={listingTransaction} />
				</Container>
			</TitleContainer>
		);
	},
});
