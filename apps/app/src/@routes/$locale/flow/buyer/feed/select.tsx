import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { feedCreateDefault } from "~/app/@buyer-user/feed/service/feedCreateDefault";
import { FeedListContainer } from "~/app/@buyer-user/feed/ui/FeedListContainer";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/buyer/feed/select")({
	async loader({ context: { queryClient } }) {
		/**
		 * Dummy catch is intentional - we don't care about results here (not found throws an error).
		 */
		const feed = await withFeedQuery.fetch({}).catch(() => undefined);
		if (!feed) {
			await feedCreateDefault({
				queryClient,
			});
		}
	},
	component() {
		const locale = useLocale();

		const feedCountLimit = 3;

		return (
			<TitleContainer
				data-ui={"FeedSelect"}
				textTitle={"Feed select (title)"}
				ui={{
					layout: "vertical-header-content",
				}}
				right={<HomeMenuButton />}
			>
				<FeedListContainer
					data-ui={"/buyer/feed/select[FeedListContainer]"}
					query={{
						cursor: {
							page: 0,
							size: feedCountLimit,
						},
						sort: [
							{
								field: "createdAt",
								order: "desc",
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
								ui={{
									display: "block",
									height: "full",
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
