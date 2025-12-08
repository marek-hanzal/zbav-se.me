import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { asButton } from "@use-pico/theme/button";
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
						{...asButton({
							round: "full",
							size: "md",
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<ListingCartFeedList
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
