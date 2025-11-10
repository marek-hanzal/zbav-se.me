import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingScoreQuery } from "@zbav-se.me/sdk/query";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ScoreContainer } from "~/app/listing/ui/ScoreContainer";

export const Route = createFileRoute("/$locale/buyer/listing/$id/score")({
	component() {
		const { locale, id } = Route.useParams();

		const listingScoreQuery = withListingScoreQuery.useSuspenseQuery(id);

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/listing/$id/view"}
						params={{
							locale,
							id,
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
