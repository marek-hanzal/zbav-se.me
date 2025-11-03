import { ArrowRightIcon, EditIcon, TrashIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tFeedDto } from "@zbav-se.me/sdk";
import { type FC, useState } from "react";
import { withFeedDeleteMutation } from "~/app/feed/mutation/withFeedDeleteMutation";
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
	const [isConfirm, setIsConfirm] = useState(false);

	const deleteMutation = withFeedDeleteMutation.useMutation({
		async onPostMutation() {
			setIsConfirm(false);
		},
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
				<div className="flex flex-row gap-2 items-center">
					<Button
						iconEnabled={TrashIcon}
						tone={isConfirm ? "danger" : "secondary"}
						onClick={() => {
							if (!isConfirm) {
								setIsConfirm(true);
								setTimeout(() => {
									setIsConfirm(false);
								}, 3000);
								return;
							}

							deleteMutation.mutate({
								where: {
									id: feed.id,
								},
							});
						}}
						size={"sm"}
					/>

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
				</div>

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
