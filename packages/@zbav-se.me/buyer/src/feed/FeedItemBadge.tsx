import { ArrowRightIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { ListingCountBadge } from "@zbav-se.me/common/listing";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";

export namespace FeedItemBadge {
	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		feed: tFeed;
	}
}

export const FeedItemBadge: FC<FeedItemBadge.Props> = ({ locale, feed, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
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
					<Button
						iconEnabled={FeedIcon}
						tone={"secondary"}
						label={"Detail (link)"}
						onClick={() => setIsOpen(true)}
					/>

					<ListingCountBadge
						locale={locale}
						query={feed.query}
					/>
				</div>
			</Badge>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
			>
				pica
			</BottomSheet>
		</>
	);
};
