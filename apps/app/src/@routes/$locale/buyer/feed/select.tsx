import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { useToast } from "@use-pico/client/ui/toast";
import { genId } from "@use-pico/common/gen-id";
import { SpinnerContainer, TitleContainer } from "@zbav-se.me/ui/container";
import z from "zod";
import { FeedList } from "~/app/feed/ui/FeedList";

export const Route = createFileRoute("/$locale/buyer/feed/select")({
	validateSearch: z.object({
		feedId: z.string().optional(),
	}),
	ssr: false,
	pendingComponent() {
		const { locale } = Route.useParams();

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
						tone={"secondary"}
					/>
				}
			>
				<SpinnerContainer
					disableOverlay
					tone={"unset"}
					theme={"unset"}
					square={"unset"}
				/>
			</TitleContainer>
		);
	},
	component() {
		const { locale } = Route.useParams();
		const search = Route.useSearch();
		const navigate = Route.useNavigate();

		const feedCountLimit = 10;

		const toast = useToast();

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
						tone={"secondary"}
					/>
				}
			>
				<Button
					onClick={() => {
						toast({
							id: genId(),
							render() {
								return <Badge>Hovno!</Badge>;
							},
						});
					}}
				>
					test
				</Button>

				<FeedList
					query={{
						cursor: {
							page: 0,
							size: feedCountLimit,
						},
						sort: [
							{
								value: "updatedAt",
								sort: "desc",
							},
						],
					}}
					locale={locale}
					limit={feedCountLimit}
					scrollTo={search.feedId}
					onClickCreate={() => {
						navigate({
							to: "/$locale/buyer/feed/wizard/location",
						});
					}}
				/>
			</TitleContainer>
		);
	},
});
