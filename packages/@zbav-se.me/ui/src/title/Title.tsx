import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC, ReactNode } from "react";

export namespace Title {
	export interface Props extends Container.Props {
		textTitle: string;
		textTitleProps?: Tx.PropsEx;
		textSubtitle?: string;
		right?: ReactNode;
		left?: ReactNode;
	}
}

export const Title: FC<Title.Props> = ({
	textTitle,
	textTitleProps,
	textSubtitle,
	right,
	left,
	//
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"Title[Container]"}
			ui={{
				layout: "horizontal-flex",
				items: "center",
				justify: "space-between",
				inner: "xl",
				width: "full",
				color: "lead",
				tone: "brand",
				theme: "light",
				background: "alt",
				shadow: true,
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"Title-[Container.wrapper]"}
				ui={{
					layout: "vertical-flex",
					items: "start",
					justify: "center",
				}}
			>
				<Container
					data-ui={"Title-[Container.title]"}
					ui={{
						layout: "horizontal-flex",
						items: "center",
						justify: "center",
						gap: "sm",
					}}
				>
					{left}

					<Tx
						data-ui={"Title-[Tx.title]"}
						label={textTitle}
						{...textTitleProps}
						ui={{
							text: "lg",
							font: "bold",
							display: "block",
							truncate: true,
							...textTitleProps?.ui,
						}}
					/>
				</Container>

				{textSubtitle ? (
					<Tx
						data-ui={"Title-[Tx.subtitle]"}
						label={textSubtitle}
						ui={{
							tone: "secondary",
							theme: "light",
							text: "md",
						}}
					/>
				) : null}
			</Container>

			{right}
		</Container>
	);
};
