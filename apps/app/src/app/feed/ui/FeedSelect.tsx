import {
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	Status,
} from "@use-pico/client";
import type { FeedDto } from "@zbav-se.me/sdk";
import { FeedIcon, Sheet } from "@zbav-se.me/ui";
import type { FC } from "react";

export namespace FeedSelect {
	export interface Props extends Omit<Sheet.Props, "slot" | "onChange"> {
		locale: string;
		feed: FeedDto | undefined;
	}
}

export const FeedSelect: FC<FeedSelect.Props> = ({
	feed,
	locale,
	...props
}) => {
	return (
		<Container
			ui="FeedSelect-Container"
			position="relative"
		>
			<Sheet
				ui="FeedSelect-Sheet"
				{...props}
			>
				{feed ? (
					<Status
						icon={FeedIcon}
						textTitle={feed.name}
					/>
				) : props.disabled ? (
					<Status
						icon={FeedIcon}
						textTitle={"Create new feed - disabled (title)"}
						textMessage={"Create new feed - disabled (description)"}
					/>
				) : (
					<Status
						icon={FeedIcon}
						textTitle={"Create new feed (title)"}
						textMessage={"Create new feed (description)"}
						action={
							<LinkTo
								to={"/$locale/buyer/feed/wizard/start"}
								params={{
									locale,
								}}
								tone={"primary"}
								display={"block"}
							>
								<Button
									iconEnabled={ArrowRightIcon}
									iconPosition={"right"}
									label={"Create new feed (button)"}
									tone={"primary"}
									theme={"dark"}
									size={"xl"}
								/>
							</LinkTo>
						}
					/>
				)}
			</Sheet>
		</Container>
	);
};
