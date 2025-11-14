import { ArrowRightIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tFeed, tListingQuery } from "@zbav-se.me/sdk/api/session";
import { withListingCountQuery } from "@zbav-se.me/sdk/query/session";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace FeedItem {
	export interface Props {
		feed: tFeed;
		locale: string;
	}
}

export const FeedItem: FC<FeedItem.Props> = ({ feed, locale }) => {
	const query: tListingQuery = {
		filter: feed.filter,
		sort: feed.sort,
		meta: feed.meta,
	};

	const listingCountQuery = withListingCountQuery.useSuspenseQuery(query);

	return (
		<Badge
			tone={"primary"}
			round={"md"}
			tweak={{
				slot: {
					root: {
						class: [
							"flex-col",
							"gap-2",
							"w-full",
							"h-fit",
							"items-start",
							"py-2",
							"px-4",
						],
					},
				},
			}}
		>
			<LinkTo
				icon={ArrowRightIcon}
				to={"/$locale/buyer/listing/list"}
				params={{
					locale,
				}}
				search={{
					query,
				}}
				iconPosition={"right"}
				full
			>
				<Typo
					label={feed.name}
					font={"bold"}
					truncate
				/>
			</LinkTo>

			<div
				className={
					"flex flex-row gap-2 items-center justify-between w-full"
				}
			>
				<LinkTo
					icon={FeedIcon}
					to={"/$locale/buyer/feed/$id/view"}
					params={{
						locale,
						id: feed.id,
					}}
					tone={"secondary"}
				>
					<Tx label={"Detail (link)"} />
				</LinkTo>

				<Badge
					tone={"secondary"}
					theme={"light"}
					size={"xs"}
					tweak={{
						slot: {
							root: {
								class: [
									"flex-shrink-0",
								],
							},
						},
					}}
				>
					<Tx label={"Number of listings (label)"} />
					<Typo
						label={toLocaleNumber({
							locale,
							number: listingCountQuery.data.filter,
						})}
						font={"bold"}
					/>
				</Badge>
			</div>
		</Badge>
	);
};
