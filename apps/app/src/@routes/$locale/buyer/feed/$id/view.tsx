import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Suspense } from "react";
import { FeedContainer } from "~/app/feed/ui/FeedContainer";

export const Route = createFileRoute("/$locale/buyer/feed/$id/view")({
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
					/>
				}
			>
				<Suspense fallback={<SpinnerContainer />}>
					<FeedContainer feed={feed} />
				</Suspense>
			</TitleContainer>
		);
	},
});
