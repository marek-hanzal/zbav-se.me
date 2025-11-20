import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";
import { SellerMenu } from "~/app/seller/ui/SellerMenu";

export const Route = createFileRoute("/$locale/seller")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				ui="Seller-root"
				textTitle={"Seller home (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to="/$locale/dashboard"
						params={{
							locale,
						}}
					/>
				}
			>
				<SellerMenu />

				<SignOutButton
					tweak={{
						slot: {
							wrapper: {
								class: [
									"mx-auto",
								],
							},
						},
					}}
				/>
			</TitleContainer>
		);
	},
	async loader({ context: { queryClient } }) {
		await Promise.all([
			withListingTransactionCollectionQuery.prefetch(queryClient, {
				sort: [
					{
						field: "updatedAt",
						direction: "desc",
					},
				],
				meta: {
					side: "seller",
				},
			}),
		]);
	},
});
