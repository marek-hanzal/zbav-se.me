import { isString } from "effect/Predicate";
import type { FC, ReactNode } from "react";
import { Container } from "@/lib/client/container";
import { Tx } from "@/lib/client/tx";

export namespace Title {
	export interface Props extends Container.Props {
		textTitle: string;
		textTitleProps?: Tx.PropsEx;
		textSubtitle?: string | ReactNode;
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
			data-ui={"Title"}
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
				ui={{
					layout: "vertical-flex",
					items: "start",
					justify: "center",
				}}
			>
				<Container
					ui={{
						layout: "horizontal-flex",
						items: "center",
						justify: "center",
						gap: "sm",
					}}
				>
					{left}

					<Tx
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
					isString(textSubtitle) ? (
						<Tx
							label={textSubtitle}
							ui={{
								tone: "secondary",
								theme: "light",
								text: "md",
							}}
						/>
					) : (
						textSubtitle
					)
				) : null}
			</Container>

			{right}
		</Container>
	);
};
