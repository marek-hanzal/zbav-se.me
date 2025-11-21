import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { FeedContainer } from "~/app/@buyer/feed/ui/FeedContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/view")({
	component() {
		const { id } = Route.useParams();

		const feedFetchQuery = withFeedFetchQuery.useSuspenseQuery({
			where: {
				id,
			},
		});
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Feed detail (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/select"}
						params={{
							locale,
						}}
					/>
				}
			>
				<FeedContainer feed={feedFetchQuery.data} />
			</TitleContainer>
		);
	},
});
