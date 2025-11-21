import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import {
	withCategoryCartCollectionQuery,
	withFeedCollectionQuery,
	withFeedCountQuery,
	withListingTransactionCollectionQuery,
} from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { BuyerMenu } from "~/app/@buyer/ui/BuyerMenu";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

export const Route = createFileRoute("/$locale/buyer/")({
	async loader({ context: { queryClient }, params: { locale } }) {
		await Promise.all([
			withListingTransactionCollectionQuery.prefetch(queryClient, {
				sort: [
					{
						field: "updatedAt",
						direction: "desc",
					},
				],
				meta: {
					side: "buyer",
				},
			}),
			withFeedCountQuery.prefetch(queryClient, {}),
			withFeedCollectionQuery.prefetch(queryClient, {
				cursor: {
					page: 0,
					size: 10,
				},
				sort: [
					{
						field: "updatedAt",
						direction: "desc",
					},
				],
			}),
			withCategoryCartCollectionQuery.prefetch(queryClient, {
				cursor: {
					page: 0,
					size: 256,
				},
				filter: {
					locale,
				},
				sort: [
					{
						field: "listingCount",
						direction: "desc",
					},
				],
			}),
		]);
	},
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Buyer home (title)"}
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
				<BuyerMenu locale={locale} />

				<SignOutButton
					locale={locale}
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
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Buyer home (title)"}
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
				<BuyerMenu locale={locale} />

				<SignOutButton
					locale={locale}
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
});
