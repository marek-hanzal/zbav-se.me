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
	...props
}) => {
	return (
		<Container
			data-ui={"Title"}
			data-ui-layout="horizontal-flex"
			data-ui-items="center"
			data-ui-justify="space-between"
			data-ui-inner="xl"
			data-ui-width="full"
			data-ui-color="lead"
			data-ui-tone="brand"
			data-ui-theme="light"
			data-ui-background="alt"
			data-ui-shadow
			{...props}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-items="start"
				data-ui-justify="center"
			>
				<Container
					data-ui-layout="horizontal-flex"
					data-ui-items="center"
					data-ui-justify="center"
					data-ui-gap="sm"
				>
					{left}

					<Tx
						label={textTitle}
						data-ui-text="lg"
						data-ui-font="bold"
						data-ui-display="block"
						data-ui-truncate
						{...textTitleProps}
					/>
				</Container>

				{textSubtitle ? (
					isString(textSubtitle) ? (
						<Tx
							label={textSubtitle}
							data-ui-tone="secondary"
							data-ui-theme="light"
							data-ui-text="md"
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
