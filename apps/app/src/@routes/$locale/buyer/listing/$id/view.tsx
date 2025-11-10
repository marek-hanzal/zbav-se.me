import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Spinner } from "@use-pico/client/ui/spinner";
import { zListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingScoreCreateMutation } from "@zbav-se.me/sdk/mutation";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useEffect } from "react";
import { ListingDetailContainer } from "~/app/listing/ui/ListingDetailContainer";

export const Route = createFileRoute("/$locale/buyer/listing/$id/view")({
	validateSearch: zListingQuery,
	pendingComponent() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();

		return (
			<TitleContainer
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
		const query = Route.useSearch();
		const listingQuery = withListingFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
		});

		const listingScoreCreateMutation =
			withListingScoreCreateMutation.useMutation();

		useEffect(() => {
			const timeoutId = setTimeout(() => {
				listingScoreCreateMutation.mutate({
					listingId: id,
					score: "view",
				});
			}, 2_500);

			return () => clearTimeout(timeoutId);
		}, []);

		return (
			<TitleContainer
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
						tone={"secondary"}
					/>
				}
				textTitle={"Listing detail (title)"}
			>
				<Container scroll={"vertical"}>
					<ListingDetailContainer
						query={query}
						listing={listingQuery.data}
					>
						<Button>toolbar</Button>
					</ListingDetailContainer>
				</Container>
			</TitleContainer>
		);
	},
});
