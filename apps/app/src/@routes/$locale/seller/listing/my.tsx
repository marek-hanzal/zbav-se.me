import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/listing/my")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"My listings (title)"}
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
				some other day, bro
			</TitleContainer>
		);
	},
});
