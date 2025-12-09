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
	...props
}) => {
	return (
		<Container
			data-ui={"Title"}
			ui={{
				layout: "horizontal-flex",
				items: "center",
				justify: "space-between",
				inner: "default",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-flex",
					items: "start",
					justify: "center",
				}}
			>
				<div data-ui={"Title-title"}>
					{left ? <div data-ui="Title-left">{left}</div> : null}

					<Tx
						data-ui={"Title-title-text"}
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
						data-ui={"Title-subtitle"}
						label={textSubtitle}
						ui={{
							tone: "secondary",
							theme: "light",
							size: "sm",
						}}
					/>
				) : null}
			</Container>

			{right ? <div data-ui="Title-right">{right}</div> : null}
		</Container>
	);
};
