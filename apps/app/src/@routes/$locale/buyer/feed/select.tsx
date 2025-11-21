import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { FeedList } from "~/app/@buyer/feed/ui/FeedList";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	component() {
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();

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
				<FeedList
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
					onClickCreate={() => {
						navigate({
							to: "/$locale/buyer/feed/wizard/location",
						});
					}}
				/>
			</TitleContainer>
		);
	},
});
