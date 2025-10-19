import type { useSnapperNav } from "@use-pico/client";
import type { FC } from "react";
import { LeftButton } from "~/app/listing/ui/CreateListing/LeftButton";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { NextButton } from "~/app/listing/ui/CreateListing/NextButton";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export namespace ListingContainer {
	export interface Props extends FlowContainer.Props {
		listingNavApi: useSnapperNav.Api;
		progress?: boolean;
		textTitle?: string;
		textSubtitle?: string;
		titleProps?: Omit<Title.Props, "textTitle">;
		back?: boolean;
		bottom?: {
			next: boolean;
		};
	}
}

export const ListingContainer: FC<ListingContainer.Props> = ({
	progress = true,
	textTitle,
	textSubtitle,
	titleProps,
	back = true,
	bottom,
	listingNavApi,
	children,
	...props
}) => {
	return (
		<FlowContainer {...props}>
			{progress ? <ListingProgress /> : null}

			{textTitle ? (
				<Title
					textTitle={textTitle}
					textSubtitle={textSubtitle}
					left={
						back ? (
							<LeftButton listingNavApi={listingNavApi} />
						) : undefined
					}
					{...titleProps}
				/>
			) : (
				<div />
			)}

			{children ? <div className={"relative"}>{children}</div> : null}

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
