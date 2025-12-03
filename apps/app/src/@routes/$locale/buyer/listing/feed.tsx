import { createFileRoute, redirect } from "@tanstack/react-router";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedFetchQuery } from "@zbav-se.me/sdk/query/user";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { FlowContainer } from "@zbav-se.me/ui/container";
import z from "zod";

export const Route = createFileRoute("/$locale/buyer/listing/feed")({
	validateSearch: z.object({
		feedId: z.string().optional(),
	}),
	loaderDeps({ search: { feedId } }) {
		return {
			feedId,
		};
	},
	/**
	 * Simple stuff:
	 *
	 * - pick most recent feed (create a new one if not present)
	 * - redirect user to listings with that feedId
	 *
	 * The idea is to _ensure_ we've a feed a user _can_ customize
	 */
	async loader({ context: { queryClient }, params: { locale }, deps: { feedId } }) {
		let feed = await withFeedFetchQuery
			.query({
				where: feedId
					? {
							id: feedId,
						}
					: undefined,
				sort: feedId
					? undefined
					: [
							{
								field: "updatedAt",
								direction: "desc",
							},
						],
			})
			.catch(() => undefined);

		if (!feed) {
			feed = await withFeedCreateMutation.mutate(queryClient, {
				name: translator.text("Feed name (default)"),
				query: {
					where: {
						withOwn: false,
					},
				},
			});
		}

		throw redirect({
			to: "/$locale/buyer/listing/list",
			params: {
				locale,
			},
			search: {
				feedId: feed.id,
				query: feed.query,
			},
		});
	},
	pendingComponent() {
		const { locale } = Route.useParams();

		return (
			<FlowContainer
				left={
					<LinkTo
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
				}
			>
				<SpinnerContainer />
			</FlowContainer>
		);
	},
});
