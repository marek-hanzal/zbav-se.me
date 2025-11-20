import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { tvc } from "@use-pico/cls";
import {
	withListingTransactionFetchQuery,
	withListingTransactionLogCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { AcceptTransactionButton } from "~/app/listing-transaction/ui/seller/AcceptTransactionButton";
import { RejectTransactionButton } from "~/app/listing-transaction/ui/seller/RejectTransactionButton";
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
	pendingComponent() {
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
				<SpinnerContainer />
			</TitleContainer>
		);
	},
	component() {
		const { locale, id } = Route.useParams();
		const navigate = Route.useNavigate();

		const listingTransactionQuery = withListingTransactionFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
			meta: {
				side: "seller",
			},
		});

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

				{listingTransactionQuery.data.status === "request" ? (
					<div
						className={tvc([
							"flex",
							"gap-2",
							"w-full",
							"items-center",
							"justify-center",
						])}
					>
						<RejectTransactionButton
							listingTransactionId={id}
							onSuccess={() => {
								return navigate({
									href: "/$locale/seller/transaction/$id/view",
									params: {
										locale,
										id,
									},
								});
							}}
						/>

						<AcceptTransactionButton
							listingTransactionId={id}
							onSuccess={() => {
								return navigate({
									href: "/$locale/seller/transaction/$id/view",
									params: {
										locale,
										id,
									},
								});
							}}
						/>
					</div>
				) : null}
			</TitleContainer>
		);
	},
});
