import { isString } from "@use-pico/common/is-string";
import type { FC, ReactNode } from "react";
import { Container } from "../container";
import { Tx } from "../tx/Tx";

/**
 * Badge component with label and value display.
 *
 * @group ui
 */
export namespace BadgeValue {
	export interface Props extends Container.Props {
		/**
		 * Translation label for the badge label text.
		 */
		textLabel?: string;
		/**
		 * Value text to display in the badge.
		 */
		textValue: ReactNode;
		textValueProps?: Tx.PropsEx;
		action?: ReactNode;
	}

	export type PropsEx = Omit<Props, "textValue">;
}

export const BadgeValue: FC<BadgeValue.Props> = ({
	textLabel,
	textValue,
	textValueProps,
	action,
	//
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"BadgeValue[Container]"}
			ui={{
				tone: "neutral",
				theme: "light",
				inner: "default",
				round: "default",
				background: "default",
				border: true,
				shadow: true,
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"BadgeValue-[Container.label-wrapper]"}
				ui={{
					tone: "primary",
					theme: "light",
					flow: "horizontal",
					items: "center",
					justify: "space-between",
					gap: "default",
					color: "lead",
				}}
			>
				<Tx
					label={textLabel}
					preset={"label"}
					ui={{
						font: "normal",
						display: "block",
						color: "lead",
					}}
				/>

				{action}
			</Container>

			{isString(textValue) ? (
				<Tx
					label={textValue}
					ui={{
						tone: "secondary",
						font: "bold",
						display: "block",
						truncate: true,
					}}
					{...textValueProps}
				/>
			) : (
				textValue
			)}
		</Container>
	);
};
