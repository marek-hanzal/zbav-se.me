import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedListContainer } from "@zbav-se.me/common/feed";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	component() {
		const { locale } = Route.useParams();

		const feedCountLimit = 10;

		return (
			<TitleContainer
				textTitle={"Feed select (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
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
