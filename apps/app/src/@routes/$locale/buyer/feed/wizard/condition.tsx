import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client";
import { TitleContainer } from "@zbav-se.me/ui";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/condition")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Feed condition (title)"}
				left={
					<LinkTo
						to={"/$locale/buyer/feed/wizard/sort"}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
			>
				bla
			</TitleContainer>
		);
	},
});
