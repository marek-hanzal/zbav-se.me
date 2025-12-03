import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedListContainer } from "@zbav-se.me/common/feed";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	validateSearch: z.object({
		scrollToId: z.string().optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const { scrollToId } = Route.useSearch();

		const feedCountLimit = 10;

		return (
			<TitleContainer
				ui={"FeedSelect-root"}
				layout={"vertical-header-content"}
				textTitle={"Feed select (title)"}
				left={
					<LinkTo
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
			>
				<FeedListContainer
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
					scrollToId={scrollToId}
					linkTo={({ children, feed }) => {
						return (
							<LinkTo
								to={"/$locale/buyer/feed/$id/list"}
								params={{
									locale,
									id: feed.id,
								}}
							>
								{children}
							</LinkTo>
						);
					}}
				/>
			</TitleContainer>
		);
	},
});
