import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Spinner } from "@use-pico/client/ui/spinner";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/session";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { CategoryIdQuerySchema } from "~/app/category/schema/CategoryIdQuerySchema";
import { ListingDetailContainer } from "~/app/listing/ui/ListingDetailContainer";
import { ListingDetailMenu } from "~/app/listing/ui/ListingDetailMenu";

export const Route = createFileRoute("/$locale/buyer/cart/listing/$id/view")({
	validateSearch: CategoryIdQuerySchema,
	pendingComponent() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/cart/category/$id/feed"}
						params={{
							locale,
							id: query.categoryId,
						}}
						search={{
							scrollToListingId: id,
						}}
					/>
				}
				textTitle={"Listing detail (title)"}
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
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/cart/category/$id/feed"}
						params={{
							locale,
							id: query.categoryId,
						}}
						search={{
							scrollToListingId: id,
						}}
					/>
				}
				textTitle={"Listing detail (title)"}
			>
				<Container scroll={"vertical"}>
					<ListingDetailContainer
						query={undefined}
						listing={listingQuery.data}
						withScore
						renderScoreBadge={({ children }) => (
							<LinkTo
								to={"/$locale/buyer/cart/listing/$id/score"}
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
								to={"/$locale/buyer/cart/listing/$id/seller"}
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
