import {
	ArrowRightIcon,
	Badge,
	Button,
	Container,
	Data,
	LinkTo,
	Spinner,
	Status,
	Tx,
} from "@use-pico/client";
import type { tFeedDto } from "@zbav-se.me/sdk";
import { FeedIcon } from "@zbav-se.me/ui";
import type { FC } from "react";
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
	const listingCountQuery = withListingCountQuery.useQuery({
		filter: feed.filter,
	});

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
					<LinkTo
						to={"/$locale/buyer/feed/$id"}
						params={{
							locale,
							id: feed.id,
						}}
					>
						<Button
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							size={"lg"}
							tone={"secondary"}
							theme={"dark"}
						/>
					</LinkTo>
				}
				tweak={{
					slot: {
						body: {
							class: [
								"flex",
								"flex-col",
								"justify-center",
								"items-center",
							],
						},
					},
				}}
			>
				<Data
					result={listingCountQuery}
					renderLoading={() => <Spinner />}
					renderSuccess={({ data }) => {
						return (
							<Badge>
								{data.filter > 0 ? (
									data.filter
								) : (
									<Tx label={"No listings found (label)"} />
								)}
							</Badge>
						);
					}}
				/>
			</Status>
		</Container>
	);
};
