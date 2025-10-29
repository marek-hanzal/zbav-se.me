import { Container } from "@use-pico/client";
import type { FeedDto } from "@zbav-se.me/sdk";
import { Sheet } from "@zbav-se.me/ui";
import type { FC } from "react";

export namespace FeedSelect {
	export interface Props extends Omit<Sheet.Props, "slot" | "onChange"> {
		feed: FeedDto | undefined;
	}
}

export const FeedSelect: FC<FeedSelect.Props> = ({ feed, ...props }) => {
	return (
		<Container
			ui="FeedSelect-Container"
			position="relative"
		>
			<Sheet
				ui="FeedSelect-Sheet"
				{...props}
			>
				blabla
			</Sheet>
		</Container>
	);
};
