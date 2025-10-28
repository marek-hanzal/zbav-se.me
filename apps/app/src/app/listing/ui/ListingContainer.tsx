import type { FC, ReactNode } from "react";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { FlowContainer } from "~/app/ui/container/FlowContainer";
import { Title } from "~/app/ui/title/Title";

export namespace ListingContainer {
	export interface Props extends FlowContainer.Props {
		textTitle?: string;
		textSubtitle?: string;
		titleProps?: Omit<Title.Props, "textTitle">;
		left?: ReactNode;
		bottom?: ReactNode;
	}
}

export const ListingContainer: FC<ListingContainer.Props> = ({
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

			{children}

			{bottom ? <BottomContainer>{bottom}</BottomContainer> : null}
		</FlowContainer>
	);
};
