import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { SpinnerContainer, TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { FeedList } from "~/app/feed/ui/FeedList";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	validateSearch: z.object({
		feedId: z.string().optional(),
	}),
	pendingComponent() {
		const { locale } = Route.useParams();

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
						tone={"secondary"}
					/>
				}
			>
				<SpinnerContainer
					disableOverlay
					tone={"unset"}
					theme={"unset"}
					square={"unset"}
				/>
			</TitleContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const search = Route.useSearch();
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
						tone={"secondary"}
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
					locale={locale}
					limit={feedCountLimit}
					scrollTo={search.feedId}
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
