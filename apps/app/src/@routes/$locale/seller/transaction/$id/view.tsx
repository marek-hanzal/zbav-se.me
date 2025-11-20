import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionLogList } from "~/app/listing-transaction-log/ui/TransactionLogList";

export const Route = createFileRoute("/$locale/seller/transaction/$id/view")({
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

		const listingTransactionFetchQuery = withListingTransactionFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
			meta: {
				side: "seller",
			},
		});
		const listingTransaction = listingTransactionFetchQuery.data;

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
				<TransactionLogList
					side={"seller"}
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
			</TitleContainer>
		);
	},
});
