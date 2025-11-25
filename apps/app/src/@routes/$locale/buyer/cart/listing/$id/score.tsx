import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { ScoreContainer } from "@zbav-se.me/buyer/listing";
import { withListingMetricsFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { CategoryIdQuerySchema } from "~/app/category/schema/CategoryIdQuerySchema";

export const Route = createFileRoute("/$locale/buyer/cart/listing/$id/score")({
	validateSearch: CategoryIdQuerySchema,
	component() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();

		const listingMetricsQuery = withListingMetricsFetchQuery.useSuspenseQuery(id);

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/cart/listing/$id/view"}
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
