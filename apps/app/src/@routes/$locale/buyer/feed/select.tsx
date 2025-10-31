import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, LinkTo } from "@use-pico/client";
import { SpinnerContainer, TitleContainer } from "@zbav-se.me/ui";
import z from "zod";
import { FeedList } from "~/app/feed/ui/FeedList";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	validateSearch: z.object({
		feedId: z.string().optional(),
	}),
	ssr: false,
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
		const navigate = useNavigate();

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
								value: "updatedAt",
								sort: "asc",
							},
						],
					}}
					locale={locale}
					limit={feedCountLimit}
					scrollTo={search.feedId}
					onClickCreate={() => {
						navigate({
							to: "/$locale/buyer/feed/wizard/location",
							params: {
								locale,
							},
						});
					}}
				/>
			</TitleContainer>
		);
	},
});
