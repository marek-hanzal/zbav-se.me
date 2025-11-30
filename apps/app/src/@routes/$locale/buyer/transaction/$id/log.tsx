import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { ListingDetailButton } from "@zbav-se.me/buyer/listing";
import { BuyerInfoButton } from "@zbav-se.me/buyer/listing-transaction";
import { TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import type { tListingTransactionLogQuery } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { SellerInfoButton } from "@zbav-se.me/seller/listing-transaction";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/log")({
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

		return (
			<TitleContainer
				textTitle={"Transaction detail (title)"}
				textSubtitle={listingTransactionFetchQuery.data.title}
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
				<TransactionLogList
					locale={locale}
					side="buyer"
					listingTransaction={listingTransactionFetchQuery.data}
					query={query}
					components={{
						BuyerInfoButton,
						SellerInfoButton,
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
			</TitleContainer>
		);
	},
});
