import { useNavigate } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	EditIcon,
	LinkTo,
	TrashIcon,
	Tx,
	Typo,
} from "@use-pico/client";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
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
	const navigate = useNavigate();

	return (
		<Container
			ui="FeedSelect-Container"
			layout={"vertical-centered"}
			items={"center"}
			position={"relative"}
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
				iconProps={{
					size: "4xl",
				}}
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
						iconEnabled={hasListings ? ArrowRightIcon : undefined}
						iconPosition={"right"}
						size={"xl"}
						tone={"secondary"}
						theme={"dark"}
						disabled={!hasListings || feedDeleteMutation.isPending}
						full
					>
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
					</Button>
				</LinkTo>

				<Button
					iconEnabled={EditIcon}
					tone={"secondary"}
					theme={"dark"}
					snapTo={"bottom-right"}
					disabled={feedDeleteMutation.isPending}
					onClick={() => {
						navigate({
							to: "/$locale/buyer/feed/wizard/location",
							params: {
								locale,
							},
							search: feed,
						});
					}}
					tweak={{
						slot: {
							root: {
								class: [
									"h-auto",
									"p-4",
								],
								token: [
									"round.full",
								],
							},
						},
					}}
				/>

				<Button
					iconEnabled={TrashIcon}
					tone={"danger"}
					theme={"dark"}
					snapTo={"bottom-left"}
					onClick={() => {
						feedDeleteMutation.mutate({
							where: {
								id: feed.id,
							},
						});
					}}
					disabled={feedDeleteMutation.isPending}
					loading={feedDeleteMutation.isPending}
					tweak={{
						slot: {
							root: {
								class: [
									"h-auto",
									"p-4",
								],
								token: [
									"round.full",
								],
							},
						},
					}}
				/>
			</Status>
		</Container>
	);
};
