import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { EpilogBadge } from "@zbav-se.me/buyer/listing-transaction";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Suspense } from "react";
import { TransactionLogList } from "~/app/@buyer/listing-transaction-log/ui/TransactionLogList";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/view")({
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
				<Suspense fallback={<SpinnerContainer />}>
					<Container
						ui={"Buyer-TransactionDetail-root"}
						gap={"lg"}
					>
						<TransactionLogList
							_suspense={"I know"}
							locale={locale}
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
				</Suspense>
			</TitleContainer>
		);
	},
});
