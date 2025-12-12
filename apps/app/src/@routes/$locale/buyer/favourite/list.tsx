import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { FeedFavouriteList } from "~/app/feed-favourite/ui/FeedFavouriteList";

export const Route = createFileRoute("/$locale/buyer/favourite/list")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Your favourites (title)"}
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/ui/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<FeedFavouriteList
					locale={locale}
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
								to={"/$locale/buyer/favourite/$feedId/list"}
								params={{
									locale,
									feedId,
								}}
							>
								{children}
							</LinkTo>
						),
					}}
				/>
			</TitleContainer>
		);
	},
});
