import {
	ArrowRightIcon,
	Badge,
	Button,
	Container,
	LinkTo,
	Status,
	TrashIcon,
	Tx,
	Typo,
} from "@use-pico/client";
import { toHumanNumber } from "@use-pico/common";
import type { tFeedDto } from "@zbav-se.me/sdk";
import { FeedIcon } from "@zbav-se.me/ui";
import type { FC } from "react";
import { withFeedDeleteMutation } from "~/app/feed/mutation/withFeedDeleteMutation";
import { withListingCountQuery } from "~/app/listing/query/withListingCountQuery";

export namespace FeedSelect {
	export interface Props extends Container.Props {
		locale: string;
		feed: tFeedDto;
	}
}

export const FeedSelect: FC<FeedSelect.Props> = ({
	feed,
	locale,
	tweak,
	...props
}) => {
	const listingCountQuery = withListingCountQuery.useSuspenseQuery({
		filter: feed.filter,
	});
	const hasListings = listingCountQuery.data.filter > 0;

	const feedDeleteMutation = withFeedDeleteMutation.useMutation();

	return (
		<Container
			ui="FeedSelect-Container"
			layout={"vertical-centered"}
			items={"center"}
			tweak={[
				tweak,
				feed
					? {
							slot: {
								root: {
									class: [
										`FeedItem-${feed.id}`,
									],
								},
							},
						}
					: undefined,
			]}
			{...props}
		>
			<Status
				icon={FeedIcon}
				textTitle={feed.name}
				action={
					<Badge>
						{hasListings ? (
							<>
								<Tx label={"Number of listings (label)"} />
								<Typo
									label={toHumanNumber({
										locale,
										number: listingCountQuery.data.filter,
									})}
									font={"bold"}
									size={"lg"}
								/>
							</>
						) : (
							<Tx label={"No listings found (label)"} />
						)}
					</Badge>
				}
				tweak={{
					slot: {
						body: {
							class: [
								"flex",
								"flex-col",
								"gap-4",
								"justify-center",
								"items-center",
							],
						},
					},
				}}
			>
				<LinkTo
					to={"/$locale/buyer/feed/$id"}
					params={{
						locale,
						id: feed.id,
					}}
					disabled={!hasListings || feedDeleteMutation.isPending}
					display={"block"}
					full
				>
					<Button
						iconEnabled={ArrowRightIcon}
						iconPosition={"right"}
						size={"lg"}
						tone={"secondary"}
						theme={"dark"}
						disabled={!hasListings || feedDeleteMutation.isPending}
						full
					/>
				</LinkTo>

				<Button
					iconEnabled={TrashIcon}
					label={"Delete feed (button)"}
					tone={"danger"}
					theme={"dark"}
					onClick={() => {
						feedDeleteMutation.mutate({
							where: {
								id: feed.id,
							},
						});
					}}
					disabled={feedDeleteMutation.isPending}
					loading={feedDeleteMutation.isPending}
				/>
			</Status>
		</Container>
	);
};
