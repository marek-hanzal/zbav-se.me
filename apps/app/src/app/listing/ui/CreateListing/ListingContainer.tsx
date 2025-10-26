import type { FC, ReactNode } from "react";
import { ListingProgress } from "~/app/listing/ui/CreateListing/ListingProgress";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export namespace ListingContainer {
	export interface Props extends FlowContainer.Props {
		progress?: boolean;
		textTitle?: string;
		textSubtitle?: string;
		titleProps?: Omit<Title.Props, "textTitle">;
		left?: ReactNode;
		bottom?: {
			next?: ReactNode;
		};
	}
}

export const ListingContainer: FC<ListingContainer.Props> = ({
	progress = true,
	textTitle,
	textSubtitle,
	titleProps,
	left,
	bottom,
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
					left={left}
					{...titleProps}
				/>
			) : (
				<div />
			)}

			{children ? (
				<div
					data-ui="ListingContainer-content"
					className={"relative"}
				>
					{children}
				</div>
			) : null}

			{bottom ? (
				<BottomContainer>
					<div />

					{bottom.next}
				</BottomContainer>
			) : null}
		</FlowContainer>
	);
};
