import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedDetailContainer } from "@zbav-se.me/buyer/feed";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { match } from "ts-pattern";

export const Route = createFileRoute("/$locale/buyer/feed/$id/view")({
	pendingComponent() {
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
				<SpinnerContainer />
			</TitleContainer>
		);
	},
	component() {
		const { id } = Route.useParams();
		const navigate = useNavigate();

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
				<FeedDetailContainer
					locale={locale}
					feed={feedFetchQuery.data}
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
							.with("view", () => (
								<LinkTo
									to={"/$locale/buyer/feed/$id/view"}
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
