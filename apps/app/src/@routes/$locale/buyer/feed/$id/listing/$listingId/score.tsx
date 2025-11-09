import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingScoreQuery } from "@zbav-se.me/sdk/query";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ScoreContainer } from "~/app/listing/ui/ScoreContainer";

export const Route = createFileRoute(
	"/$locale/buyer/feed/$id/listing/$listingId/score",
)({
	component() {
		const { locale, id, listingId } = Route.useParams();

		const listingScoreQuery =
			withListingScoreQuery.useSuspenseQuery(listingId);

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/listing/$listingId/view"}
						params={{
							locale,
							id,
							listingId,
						}}
						tone={"secondary"}
					/>
				}
				textTitle={"Listing - Score info (title)"}
			>
				<Container scroll={"vertical"}>
					<ScoreContainer
						locale={locale}
						listingScore={listingScoreQuery.data}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
