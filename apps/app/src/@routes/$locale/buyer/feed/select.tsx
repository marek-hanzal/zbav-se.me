import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedListContainer } from "@zbav-se.me/common/feed";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	component() {
		const { locale } = Route.useParams();

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
								field: "updatedAt",
								direction: "desc",
							},
						],
					}}
					limit={feedCountLimit}
				/>
			</TitleContainer>
		);
	},
});
