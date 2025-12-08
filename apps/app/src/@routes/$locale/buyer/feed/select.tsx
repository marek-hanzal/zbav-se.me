import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { asButton } from "@use-pico/theme/button";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { FeedListContainer } from "~/app/feed/ui/FeedListContainer";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	validateSearch: z.object({
		scrollToId: z.string().optional(),
	}),
	component() {
		const { locale } = Route.useParams();
		const { scrollToId } = Route.useSearch();

		const feedCountLimit = 10;

		return (
			<TitleContainer
				data-ui={"FeedSelect"}
				layout={"vertical-header-content"}
				textTitle={"Feed select (title)"}
				left={
					<LinkTo
						{...asButton({
							round: "full",
							square: "default",
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					/>
				}
			>
				<FeedListContainer
					locale={locale}
					query={{
						cursor: {
							page: 0,
							size: feedCountLimit,
						},
						sort: [
							{
								field: "createdAt",
								direction: "desc",
							},
						],
					}}
					limit={feedCountLimit}
					scrollToId={scrollToId}
					tools={[
						"setup",
					]}
					linkTo={{
						header: ({ feedId, children }) => (
							<LinkTo
								to={"/$locale/buyer/feed/$id/list"}
								params={{
									locale,
									id: feedId,
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
