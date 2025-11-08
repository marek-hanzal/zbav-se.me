import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Spinner } from "@use-pico/client/ui/spinner";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingDetailContainer } from "~/app/listing/ui/ListingDetailContainer";

export const Route = createFileRoute(
	"/$locale/buyer/feed/$id/listing/$listingId/view",
)({
	pendingComponent() {
		const { locale, id } = Route.useParams();

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/list"}
						params={{
							locale,
							id,
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
		const { locale, id, listingId } = Route.useParams();
		const listingQuery = withListingFetchQuery.useSuspenseQuery({
			where: {
				id: listingId,
			},
		});

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/list"}
						params={{
							locale,
							id,
						}}
						tone={"secondary"}
					/>
				}
				textTitle={"Listing detail (title)"}
			>
				<Container scroll={"vertical"}>
					<ListingDetailContainer
						feedId={id}
						listing={listingQuery.data}
					>
						<Button>toolbar</Button>
					</ListingDetailContainer>
				</Container>
			</TitleContainer>
		);
	},
});
