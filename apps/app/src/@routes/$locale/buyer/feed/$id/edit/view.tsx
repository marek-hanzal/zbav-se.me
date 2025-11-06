import { createFileRoute, useLoaderData } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
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
				bottom={
					<LinkTo
						to={"/$locale/buyer/feed/$id/edit/location"}
						params={{
							locale,
							id: feed.id,
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							size={"lg"}
							label={"Edit feed (button)"}
							full
						/>
					</LinkTo>
				}
			>
				<FeedContainer feed={feed} />
			</TitleContainer>
		);
	},
});
