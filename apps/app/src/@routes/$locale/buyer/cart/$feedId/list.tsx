import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/cart/$feedId/list")({
	component() {
		const { locale } = Route.useParams();
		const { feedId } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						to={"/$locale/buyer/cart/list"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
			>
				picovina
			</FlowContainer>
		);
	},
});
