import type { FC, ReactNode } from "react";
import { Container } from "@/lib/client/container";
import type { Tx } from "@/lib/client/tx";
import { Title } from "../title/Title";
import { BottomContainer } from "./BottomContainer";

export namespace TitleContainer {
	export interface Props extends Container.Props {
		textTitle?: string;
		textTitleProps?: Tx.PropsEx;
		textSubtitle?: Title.Props["textSubtitle"];
		titleProps?: Omit<Title.Props, "textTitle">;
		left?: ReactNode;
		right?: ReactNode;
		bottom?: ReactNode;
	}
}

export type TitleContainer = typeof TitleContainer;

export const TitleContainer: FC<TitleContainer.Props> = ({
	textTitle,
	textTitleProps,
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
