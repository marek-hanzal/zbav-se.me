import { createLazyFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { List } from "~/app/feed-favourite/ui/List";

export const Route = createLazyFileRoute("/$locale/ui/buyer/favourite/list")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer textTitle={"Your favourites (title)"}>
				<List
					data-ui={"/buyer/favourite/list[FeedFavouriteList]"}
					query={{
						sort: [
							{
								field: "createdAt",
								direction: "desc",
							},
						],
					}}
					linkTo={{
						header: ({ feedId, children }) => (
							<LinkTo
								data-ui={
									"/buyer/favourite/list-[FeedFavouriteList]-[LinkTo.header]"
								}
								to={"/$locale/flow/buyer/feed/$id/favourite/list"}
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
					ui={{
						inner: "default",
					}}
				/>
			</TitleContainer>
		)
	},
});
