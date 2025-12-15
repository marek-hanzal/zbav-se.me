import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { feedCreateDefault } from "~/app/feed/service/feedCreateDefault";
import { List } from "~/app/feed/ui/List";

export const Route = createFileRoute("/$locale/ui/buyer/feed/select")({
	async loader({ context: { queryClient } }) {
		/**
		 * Dummy catch is intentional - we don't care about results here (not found throws an error).
		 */
		const feed = await withFeedFetchQuery.query({}).catch(() => undefined);
		if (!feed) {
			await feedCreateDefault({
				queryClient,
			});
		}
	},
	component() {
		const { locale } = Route.useParams();

		const feedCountLimit = 3;

		return (
			<TitleContainer
				data-ui={"FeedSelect"}
				textTitle={"Feed select (title)"}
				ui={{
					layout: "vertical-header-content",
				}}
			>
				<List
					data-ui={"/buyer/feed/select[FeedListContainer]"}
					locale={locale}
					query={{
						cursor: {
							page: 0,
							size: feedCountLimit,
						},
						sort: [
							{
								field: "createdAt",
								direction: "desc",
							},
						],
					}}
					limit={feedCountLimit}
					tools={[
						"setup",
					]}
					linkTo={{
						header: ({ feedId, children }) => (
							<LinkTo
								data-ui={"/buyer/feed/select-[FeedListContainer]-[LinkTo.header]"}
								to={"/$locale/flow/buyer/feed/$id/list"}
								params={{
									locale,
									id: feedId,
								}}
							>
								{children}
							</LinkTo>
						),
					}}
				/>
			</TitleContainer>
		);
	},
});
