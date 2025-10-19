import type { useSnapperNav } from "@use-pico/client";
import type { FC } from "react";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { NextButton } from "~/app/listing/ui/CreateListing/NextButton";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";

export namespace ListingContainer {
	export interface Props extends FlowContainer.Props {
		listingNavApi: useSnapperNav.Api;
		progress?: boolean;
		bottom?: {
			next: boolean;
		};
	}
}

export const ListingContainer: FC<ListingContainer.Props> = ({
	progress = true,
	bottom,
	listingNavApi,
	children,
	...props
}) => {
	return (
		<FlowContainer {...props}>
			{progress ? <ListingProgress /> : null}

			{children}

			{bottom ? (
				<BottomContainer>
					<div />

					<NextButton
						listingNavApi={listingNavApi}
						disabled={!bottom.next}
					/>
				</BottomContainer>
			) : null}
		</FlowContainer>
	);
};
