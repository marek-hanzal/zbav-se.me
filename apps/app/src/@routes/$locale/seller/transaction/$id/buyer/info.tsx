import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { tvc } from "@use-pico/cls";
import { withListingTransactionPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import {
	withListingTransactionFetchQuery,
	withListingTransactionLogCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { AcceptTransactionButton } from "~/app/@seller/listing-transaction/ui/AcceptTransactionButton";
import { BuyerInfoContainer } from "~/app/@seller/listing-transaction/ui/BuyerInfoContainer";
import { RejectTransactionButton } from "~/app/@seller/listing-transaction/ui/RejectTransactionButton";

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

		const isTransactionPending = withListingTransactionPatchMutation.useIsMutating();

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
							"flex-col",
							"gap-2",
							"w-full",
							"items-center",
							"justify-center",
						])}
					>
						<AcceptTransactionButton
							listingTransactionId={id}
							disabled={isTransactionPending}
							onSuccess={() => {
								return navigate({
									href: "/$locale/seller/transaction/$id/view",
								});
							}}
						/>

						<RejectTransactionButton
							listingTransactionId={id}
							disabled={isTransactionPending}
							onSuccess={() => {
								return navigate({
									href: "/$locale/seller/transaction/$id/view",
								});
							}}
						/>
					</div>
				) : null}
			</TitleContainer>
		);
	},
});
