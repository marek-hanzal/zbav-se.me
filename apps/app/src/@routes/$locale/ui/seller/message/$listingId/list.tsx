import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user/listing";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { TransactionList } from "~/app/transaction/ui/TransactionList";

export const Route = createFileRoute("/$locale/ui/seller/message/$listingId/list")({
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				data-ui="/seller/message/list[TitleContainer]"
				textTitle={"Messages (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to="/$locale/ui/seller/message/list"
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
		const { listingId } = Route.useParams();
		const { locale } = Route.useParams();
		const { data: listing } = withListingFetchQuery.useSuspenseQuery({
			where: {
				id: listingId,
			},
		});

		return (
			<TitleContainer
				data-ui="/seller/message/list[TitleContainer]"
				textTitle={"Messages (title)"}
				textSubtitle={listing.title}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to="/$locale/ui/seller/message/list"
						params={{
							locale,
						}}
					/>
				}
			>
				<TransactionList
					query={{
						where: {
							listingId,
						},
						sort: [
							{
								field: "status",
								direction: "asc",
							},
							{
								field: "createdAt",
								direction: "desc",
							},
						],
						meta: {
							side: "seller",
						},
					}}
					ui={{
						inner: "default",
					}}
				/>
			</TitleContainer>
		);
	},
});
