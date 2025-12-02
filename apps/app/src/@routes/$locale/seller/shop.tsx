import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/shop")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Seller - shop (title)"}
				left={
					<LinkTo
						to={"/$locale/seller"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
			>
				Seller - shop
			</TitleContainer>
		);
	},
});
