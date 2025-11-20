import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import {
	withListingTransactionFetchQuery,
	withListingTransactionLogCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { BuyerInfoContainer } from "~/app/listing-transaction-log/ui/seller/BuyerInfoContainer";

export const Route = createFileRoute("/$locale/seller/transaction/$id/buyer/info")({
	async loader({ context: { queryClient }, params: { id } }) {
		await Promise.all([
			withListingTransactionFetchQuery.prefetch(queryClient, {
				where: {
					id,
				},
				meta: {
					side: "seller",
				},
			}),
			withListingTransactionLogCollectionQuery.prefetch(queryClient, {
				where: {
					listingTransactionId: id,
				},
				sort: [
					{
						field: "createdAt",
						direction: "desc",
					},
				],
			}),
		]);
	},
	component() {
		const { locale, id } = Route.useParams();

		return (
			<TitleContainer
				ui="BuyerInfo-root"
				textTitle="Buyer info (title)"
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/transaction/$id/view"}
						params={{
							locale,
							id,
						}}
					/>
				}
			>
				<BuyerInfoContainer listingTransactionId={id} />
			</TitleContainer>
		);
	},
});
