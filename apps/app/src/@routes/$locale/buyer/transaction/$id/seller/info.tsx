import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import {
	withListingTransactionFetchQuery,
	withListingTransactionLogCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SellerInfoContainer } from "~/app/@buyer/listing-transaction/ui/SellerInfoContainer";

export const Route = createFileRoute("/$locale/buyer/transaction/$id/seller/info")({
	async loader({ context: { queryClient }, params: { id } }) {
		await Promise.all([
			withListingTransactionFetchQuery.prefetch(queryClient, {
				where: {
					id,
				},
				meta: {
					side: "buyer",
				},
			}),
			withListingTransactionLogCollectionQuery.prefetch(queryClient, {
				where: {
					listingTransactionId: id,
				},
				sort: [
					{
						field: "createdAt",
						direction: "asc",
					},
				],
			}),
		]);
	},
	pendingComponent() {
		const { locale, id } = Route.useParams();

		return (
			<TitleContainer
				ui="SellerInfo-root"
				textTitle="Seller info (title)"
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/transaction/$id/view"}
						params={{
							locale,
							id,
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

		return (
			<TitleContainer
				ui="SellerInfo-root"
				textTitle="Seller info (title)"
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/transaction/$id/view"}
						params={{
							locale,
							id,
						}}
					/>
				}
			>
				<SellerInfoContainer listingTransactionId={id} />
			</TitleContainer>
		);
	},
});
