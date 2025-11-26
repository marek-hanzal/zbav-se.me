import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedListContainer } from "@zbav-se.me/buyer/feed";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { match } from "ts-pattern";

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
					onClickCreate={() => {
						navigate({
							to: "/$locale/buyer/feed/wizard/location",
						});
					}}
					onDelete={async () => {
						await navigate({
							to: "/$locale/buyer/feed/select",
							params: {
								locale,
							},
						});
					}}
					renderLinkTo={({ feedId, type }) => {
						return match(type)
							.with("name", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/edit/name"}
									params={{
										locale,
										id: feedId,
									}}
								/>
							))
							.with("title", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/edit/title"}
									params={{
										locale,
										id: feedId,
									}}
								/>
							))
							.with("location", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/edit/location"}
									params={{
										locale,
										id: feedId,
									}}
								/>
							))
							.with("sort", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/edit/sort"}
									params={{
										locale,
										id: feedId,
									}}
								/>
							))
							.with("category", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/edit/category"}
									params={{
										locale,
										id: feedId,
									}}
								/>
							))
							.with("condition", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/edit/condition"}
									params={{
										locale,
										id: feedId,
									}}
								/>
							))
							.with("age", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/edit/age"}
									params={{
										locale,
										id: feedId,
									}}
								/>
							))
							.exhaustive();
					}}
				/>
			</TitleContainer>
		);
	},
});
