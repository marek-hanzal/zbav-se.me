import { createFileRoute } from "@tanstack/react-router";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { FeedListContainer } from "~/app/feed/ui/FeedListContainer";

export const Route = createFileRoute("/$locale/ui/buyer/feed/select")({
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
				textTitle={"Feed select (title)"}
				ui={{
					layout: "vertical-header-content",
				}}
			>
				<FeedListContainer
					data-ui={"/buyer/feed/select[FeedListContainer]"}
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
								data-ui={"/buyer/feed/select-[FeedListContainer]-[LinkTo.header]"}
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
