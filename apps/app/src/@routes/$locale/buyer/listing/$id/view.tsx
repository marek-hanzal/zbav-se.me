import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Spinner } from "@use-pico/client/ui/spinner";
import { zListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/session";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingDetailContainer } from "~/app/listing/ui/ListingDetailContainer";
import { ListingDetailMenu } from "~/app/listing/ui/ListingDetailMenu";

export const Route = createFileRoute("/$locale/buyer/listing/$id/view")({
	validateSearch: zListingQuery,
	pendingComponent() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();

		return (
			<TitleContainer
				textTitle={"Listing detail (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/listing/list"}
						params={{
							locale,
						}}
						search={{
							scrollToListingId: id,
							query,
						}}
					/>
				}
			>
				<Spinner />
			</TitleContainer>
		);
	},
	component() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();
		const listingQuery = withListingFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
		});

		return (
			<TitleContainer
				textTitle={"Listing detail (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/listing/list"}
						params={{
							locale,
						}}
						search={{
							scrollToListingId: id,
							query,
						}}
					/>
				}
			>
				<Container scroll={"vertical"}>
					<ListingDetailContainer
						query={query}
						listing={listingQuery.data}
						withScore
						renderScoreBadge={({ children }) => (
							<LinkTo
								to={"/$locale/buyer/listing/$id/score"}
								params={{
									id,
									locale,
								}}
								search={query}
								tone="primary"
								full
							>
								{children}
							</LinkTo>
						)}
						renderSellerBadge={({ children }) => (
							<LinkTo
								to={"/$locale/buyer/listing/$id/seller"}
								params={{
									id,
									locale,
								}}
								search={query}
								tone="primary"
								full
							>
								{children}
							</LinkTo>
						)}
					>
						<ListingDetailMenu listing={listingQuery.data} />
					</ListingDetailContainer>
				</Container>
			</TitleContainer>
		);
	},
});
