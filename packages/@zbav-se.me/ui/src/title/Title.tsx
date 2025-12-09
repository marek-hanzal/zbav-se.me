import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC, ReactNode } from "react";

export namespace Title {
	export interface Props extends Container.Props {
		textTitle: string;
		textSubtitle?: string;
		right?: ReactNode;
		left?: ReactNode;
	}
}

export const Title: FC<Title.Props> = ({
	textTitle,
	textSubtitle,
	right,
	left,
	//
	ui,
	className,
	...props
}) => {
	return (
		<Container
			data-ui={"Title"}
			className={[
				"Title",
				className,
			]}
			ui={{
				inner: "default",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<div data-ui={"Title-wrapper"}>
				<div data-ui={"Title-title"}>
					{left ? <div data-ui="Title-left">{left}</div> : null}

					<Tx
						label={textTitle}
						ui={{
							tone: "primary",
							theme: "light",
							size: "xl",
							font: "bold",
							display: "block",
							truncate: true,
						}}
					/>
				</div>

				{textSubtitle ? (
					<Tx
						label={textSubtitle}
						ui={{
							tone: "secondary",
							theme: "light",
							size: "sm",
						}}
					/>
				) : null}
			</div>

			{right ? <div data-ui="Title-right">{right}</div> : null}
		</Container>
	);
};
