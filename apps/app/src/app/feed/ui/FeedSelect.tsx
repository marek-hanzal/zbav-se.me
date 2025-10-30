import {
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	Status,
} from "@use-pico/client";
import type { tFeedDto } from "@zbav-se.me/sdk";
import { FeedIcon } from "@zbav-se.me/ui";
import type { FC } from "react";

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
			/>
		</Container>
	);
};
