import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Suspense } from "react";
import { FeedList } from "~/app/feed/ui/FeedList";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	component() {
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();

		const feedCountLimit = 10;

		return (
			<TitleContainer
				textTitle={"Feed select (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<Suspense fallback={<SpinnerContainer />}>
					<FeedList
						query={{
							cursor: {
								page: 0,
								size: feedCountLimit,
							},
							sort: [
								{
									field: "updatedAt",
									direction: "desc",
								},
							],
						}}
						limit={feedCountLimit}
						onClickCreate={() => {
							navigate({
								to: "/$locale/buyer/feed/wizard/location",
							});
						}}
					/>
				</Suspense>
			</TitleContainer>
		);
	},
});
