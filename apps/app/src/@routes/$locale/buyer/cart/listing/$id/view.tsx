import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Spinner } from "@use-pico/client/ui/spinner";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/session";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { ListingDetailContainer } from "~/app/listing/ui/ListingDetailContainer";
import { ListingDetailMenu } from "~/app/listing/ui/ListingDetailMenu";

export const Route = createFileRoute("/$locale/buyer/cart/listing/$id/view")({
	validateSearch: z.object({
		categoryId: z.string(),
	}),
	pendingComponent() {
		const { locale, id } = Route.useParams();
		const { categoryId } = Route.useSearch();

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/cart/category/$id/feed"}
						params={{
							locale,
							id: categoryId,
						}}
						search={{
							scrollToListingId: id,
						}}
						tone={"secondary"}
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
		const { categoryId } = Route.useSearch();

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
							id: categoryId,
						}}
						search={{
							scrollToListingId: id,
						}}
						tone={"secondary"}
					/>
				}
				textTitle={"Listing detail (title)"}
			>
				<Container scroll={"vertical"}>
					<ListingDetailContainer
						query={undefined}
						listing={listingQuery.data}
						withScore
					>
						<ListingDetailMenu listing={listingQuery.data} />
					</ListingDetailContainer>
				</Container>
			</TitleContainer>
		);
	},
});
