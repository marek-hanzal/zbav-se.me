import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingCartFeedList } from "~/app/listing-cart-feed/ui/ListingCartFeedList";

export const Route = createFileRoute("/$locale/buyer/cart/list")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Your cart (title)"}
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
				<ListingCartFeedList
					locale={locale}
					query={{
						sort: [
							{
								field: "updatedAt",
								direction: "desc",
							},
						],
					}}
					linkTo={{
						header: ({ feedId, children }) => (
							<LinkTo
								to={"/$locale/buyer/cart/$feedId/list"}
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
