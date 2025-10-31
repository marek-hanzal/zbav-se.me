import type { FC, ReactNode } from "react";
import { Title } from "../title/Title";
import { BottomContainer } from "./BottomContainer";
import { FlowContainer } from "./FlowContainer";

export namespace TitleContainer {
	export interface Props extends FlowContainer.Props {
		textTitle?: string;
		textSubtitle?: string;
		titleProps?: Omit<Title.Props, "textTitle">;
		left?: ReactNode;
		right?: ReactNode;
		bottom?: ReactNode;
	}
}

export const TitleContainer: FC<TitleContainer.Props> = ({
	textTitle,
	textSubtitle,
	titleProps,
	left,
	right,
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
					right={right}
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
