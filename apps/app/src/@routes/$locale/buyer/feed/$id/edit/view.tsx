import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { FeedContainer } from "~/app/feed/ui/FeedContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/edit/view")({
	component() {
		const { feed } = useLoaderData({
			from: "/$locale/buyer/feed/$id",
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
						tone={"secondary"}
					/>
				}
			>
				<FeedContainer feed={feed} />
			</TitleContainer>
		);
	},
});
