import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { zListingQuery } from "@zbav-se.me/sdk/api/user";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ScoreContainer } from "~/app/listing/ui/ScoreContainer";

export const Route = createFileRoute("/$locale/buyer/listing/$id/score")({
	validateSearch: zListingQuery,
	component() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();

		const listingMetricsQuery = withListingMetricsFetchQuery.useSuspenseQuery(id);

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
						search={query}
					/>
				}
				textTitle={"Listing - Score info (title)"}
			>
				<Container scroll={"vertical"}>
					<ScoreContainer
						locale={locale}
						listingMetrics={listingMetricsQuery.data}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
