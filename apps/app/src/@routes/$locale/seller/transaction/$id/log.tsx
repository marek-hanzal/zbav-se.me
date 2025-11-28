import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { ListingDetailButton } from "@zbav-se.me/buyer/listing";
import { BuyerInfoButton } from "@zbav-se.me/buyer/listing-transaction";
import { TransactionLogList } from "@zbav-se.me/common/listing-transaction-log";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { SellerInfoButton } from "@zbav-se.me/seller/listing-transaction";
import { ChatInput } from "@zbav-se.me/ui/chat";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useState } from "react";

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
		const listingTransaction = listingTransactionFetchQuery.data;
		const [message, setMessage] = useState("");

		return (
			<TitleContainer
				ui="TransactionView-root"
				textTitle="Transaction detail (title)"
				textSubtitle={listingTransaction.title}
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
						listingTransaction={listingTransaction}
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
						components={{
							SellerInfoButton,
							BuyerInfoButton,
							ListingDetailButton({ modalRootId }) {
								return (
									<ListingDetailButton
										locale={locale}
										detailSheetId={modalRootId}
										listing={listingTransaction.listingId}
										label={"Listing detail (label)"}
									/>
								);
							},
						}}
					/>

					<ChatInput
						value={message}
						onChange={setMessage}
						onSubmit={(value) => {
							console.log(value);
						}}
						placeholder={translator.text("Enter your message (placeholder)")}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
