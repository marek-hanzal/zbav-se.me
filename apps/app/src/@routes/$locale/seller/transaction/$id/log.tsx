import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { ListingDetailButton } from "@zbav-se.me/buyer/listing";
import { BuyerInfoButton } from "@zbav-se.me/buyer/listing-transaction";
import { TransactionChat, TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import type { tListingTransactionLogQuery } from "@zbav-se.me/sdk/api/user";
import {
	withListingTransactionFetchQuery,
	withListingTransactionLogCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { SellerInfoButton } from "@zbav-se.me/seller/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/transaction/$id/log")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				ui="TransactionView-root"
				textTitle={"Transaction detail (title)"}
				textSubtitle={"..."}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/transaction/list"}
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
				side: "seller",
			},
		});

		const query: tListingTransactionLogQuery = {
			where: {
				listingTransactionId: id,
			},
			sort: [
				{
					field: "createdAt",
					direction: "asc",
				},
			],
		};

		/**
		 * Because list and chat uses the same query, we need to suspense it here to prevent UI jumps.
		 */
		const listingTransactionLogCollectionQuery =
			withListingTransactionLogCollectionQuery.useSuspenseQuery(query);

		const latestLog =
			listingTransactionLogCollectionQuery.data.data[
				listingTransactionLogCollectionQuery.data.data.length - 1
			];

		return (
			<TitleContainer
				ui="TransactionView-root"
				textTitle="Transaction detail (title)"
				textSubtitle={listingTransactionFetchQuery.data.title}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/transaction/list"}
						params={{
							locale,
						}}
					/>
				}
			>
				<Container
					ui={"Seller-TransactionLog-root"}
					layout={"vertical-content-footer"}
					gap={"lg"}
				>
					<TransactionLogList
						locale={locale}
						side="seller"
						listingTransaction={listingTransactionFetchQuery.data}
						query={query}
					/>

					{latestLog ? (
						<TransactionChat
							locale={locale}
							side="seller"
							listingTransactionLog={latestLog}
							components={{
								SellerInfoButton,
								BuyerInfoButton,
								ListingDetailButton({ modalRootId }) {
									return (
										<ListingDetailButton
											locale={locale}
											detailSheetId={modalRootId}
											listing={listingTransactionFetchQuery.data.listingId}
											label={"Listing detail (label)"}
										/>
									);
								},
							}}
						/>
					) : null}
				</Container>
			</TitleContainer>
		);
	},
});
