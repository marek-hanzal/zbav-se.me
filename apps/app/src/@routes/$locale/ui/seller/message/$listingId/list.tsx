import { createFileRoute } from "@tanstack/react-router";
import { VisibilityProvider } from "@use-pico/client/context";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { createNoopVisibilityStore } from "@use-pico/client/store";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/buyer-session/listing";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { HeroImage } from "@zbav-se.me/ui/img";
import { useState } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { ListingSheet } from "~/app/listing/ui/ListingSheet";
import { ListingOverlay } from "~/app/listing/ui/overlay/ListingOverlay";
import { TransactionList } from "~/app/transaction/ui/seller/TransactionList";

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

		const [detail, setDetail] = useState(false);
		const hero = useHeroUpload(listing.gallery.items);

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
				<Container>
					<Container
						data-ui="MessageList-[HeroContainer]"
						ui={{
							position: "relative",
							height: "content",
						}}
						onClick={() => setDetail((prev) => !prev)}
					>
						<HeroImage
							src={hero.url}
							alt={`Hero image for listing ${listing.id}`}
							className={"h-42"}
						/>
						<ListingOverlay listing={listing} />
					</Container>

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
						}}
						ui={{
							inner: "default",
						}}
					/>
				</Container>

				<VisibilityProvider store={createNoopVisibilityStore()}>
					<ListingSheet
						listing={listing}
						state={{
							value: detail,
							set: setDetail,
						}}
						withScore={false}
						feedId={undefined}
						tools={[]}
					/>
				</VisibilityProvider>
			</TitleContainer>
		);
	},
});
