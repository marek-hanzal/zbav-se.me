import { Container } from "@use-pico/client/ui/container";
import type { Tx } from "@use-pico/client/ui/tx";
import type { FC, ReactNode } from "react";
import { Title } from "../title/Title";
import { BottomContainer } from "./BottomContainer";

export namespace TitleContainer {
	export interface Props extends Container.Props {
		textTitle?: string;
		textTitleProps?: Tx.PropsEx;
		textSubtitle?: string;
		titleProps?: Omit<Title.Props, "textTitle">;
		left?: ReactNode;
		right?: ReactNode;
		bottom?: ReactNode;
	}
}

export const TitleContainer: FC<TitleContainer.Props> = ({
	textTitle,
	textTitleProps,
	textSubtitle,
	titleProps,
	left,
	right,
	bottom,
	children,
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"TitleContainer"}
			ui={{
				layout: "vertical-header-content-footer",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			{textTitle ? (
				<Title
					textTitle={textTitle}
					textTitleProps={textTitleProps}
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
