import { ArrowRightIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { ListingCountBadge } from "@zbav-se.me/common/listing";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace FeedItem {
	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		feed: tFeed;
	}
}

export const FeedItem: FC<FeedItem.Props> = ({ locale, feed, ...props }) => {
	return (
		<Badge
			tone={"primary"}
			round={"default"}
			tweak={{
				slot: {
					root: {
						class: [
							"flex-col",
							"gap-2",
							"w-full",
							"h-fit",
							"items-start",
							"py-1",
							"px-1",
						],
					},
				},
			}}
			{...props}
		>
			<LinkTo
				icon={ArrowRightIcon}
				iconProps={{
					size: "sm",
				}}
				to={"/$locale/buyer/listing/list"}
				params={{
					locale,
				}}
				search={{
					query: feed.query,
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

			<div className={"flex flex-row gap-2 items-center justify-between w-full"}>
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

				<ListingCountBadge
					locale={locale}
					query={feed.query}
				/>
			</div>
		</Badge>
	);
};
