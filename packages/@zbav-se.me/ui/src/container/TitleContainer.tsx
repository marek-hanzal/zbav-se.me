import { Container } from "@use-pico/client/ui/container";
import type { FC, ReactNode } from "react";
import { Title } from "../title/Title";
import { BottomContainer } from "./BottomContainer";

export namespace TitleContainer {
	export interface Props extends Container.Props {
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
		<Container
			layout={"vertical-header-content-footer"}
			tone={"secondary"}
			theme={"light"}
			square={"md"}
			gap={"xs"}
			position={"relative"}
			{...props}
		>
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
		</Container>
	);
};
