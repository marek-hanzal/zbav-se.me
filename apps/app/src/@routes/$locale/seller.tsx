import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

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
						to="/$locale/change-side/$side"
						params={{
							locale,
							side: "none",
						}}
					/>
				}
			>
				<SpinnerContainer />

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
