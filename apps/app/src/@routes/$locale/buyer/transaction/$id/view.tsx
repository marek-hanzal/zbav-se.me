import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingTransactionFetchQuery } from "@zbav-se.me/sdk/query/session";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionStatusIcon } from "~/app/listing-transaction/TransactionStatusIcon";
import { TransactionStatusInline } from "~/app/listing-transaction/TransactionStatusInline";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/view")({
	component() {
		const { locale, id } = Route.useParams();
		const listingTransactionFetchQuery = withListingTransactionFetchQuery.useSuspenseQuery({
			where: {
				id,
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
						tone={"secondary"}
					/>
				}
			>
				<Container>
					<Badge
						size={"xl"}
						round={"md"}
						full
					>
						<TransactionStatusIcon
							transactionStatus={listingTransaction.status}
							size={"sm"}
						/>

						<TransactionStatusInline
							size={"xl"}
							transactionStatus={listingTransaction.status}
						/>
					</Badge>
				</Container>
			</TitleContainer>
		);
	},
});
