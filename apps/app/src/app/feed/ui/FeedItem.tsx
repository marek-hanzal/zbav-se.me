import { ArrowRightIcon, EditIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toHumanNumber } from "@use-pico/common";
import type { tFeedDto } from "@zbav-se.me/sdk";
import type { FC } from "react";
import { withListingCountQuery } from "~/app/listing/query/withListingCountQuery";

export namespace FeedItem {
	export interface Props {
		feed: tFeedDto;
		locale: string;
	}
}

export const FeedItem: FC<FeedItem.Props> = ({ feed, locale }) => {
	const listingCountQuery = withListingCountQuery.useSuspenseQuery({
		filter: feed.filter,
	});

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
				to={"/$locale/buyer/feed/$id"}
				params={{
					locale,
					id: feed.id,
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
					icon={EditIcon}
					to={"/$locale/buyer/feed/wizard/location"}
					params={{
						locale,
					}}
					search={feed}
					tone={"secondary"}
				>
					<Tx label={"Edit (link)"} />
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
						label={toHumanNumber({
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
