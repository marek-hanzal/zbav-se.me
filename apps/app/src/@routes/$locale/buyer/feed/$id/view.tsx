import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { FeedContainer } from "~/app/feed/ui/FeedContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/view")({
	component() {
		const { feed } = useLoaderData({
			from: "/$locale/buyer/feed/$id",
		});

		return (
			<TitleContainer>
				<FeedContainer feed={feed} />
			</TitleContainer>
		);
	},
});
