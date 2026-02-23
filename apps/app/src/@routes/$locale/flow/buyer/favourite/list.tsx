import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { FavouriteListContainer } from "~/app/@buyer-user/feed-favourite/ui/FavouriteListContainer";
import { HomeMenuButton } from "~/app/@user/home/HomeMenuButton";

export const Route = createFileRoute("/$locale/flow/buyer/favourite/list")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={translator.text("Your favourites (title)")}
				right={<HomeMenuButton />}
			>
				<FavouriteListContainer
					data-ui={"/buyer/favourite/list[FeedFavouriteList]"}
					query={{
						sort: [
							{
								field: "createdAt",
								order: "desc",
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
		);
	},
});
