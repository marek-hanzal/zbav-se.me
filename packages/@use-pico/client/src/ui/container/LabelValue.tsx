import { isString } from "@use-pico/common/is-string";
import type { FC, ReactNode } from "react";
import { Tx } from "../tx/Tx";
import { Container } from "./Container";

/**
 * Badge component with label and value display.
 *
 * @group ui
 */
export namespace LabelValue {
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
		textHint?: string;
		action?: ReactNode;
	}

	export type PropsEx = Omit<Props, "textValue">;
}

export const LabelValue: FC<LabelValue.Props> = ({
	textLabel,
	textValue,
	textValueProps,
	textHint,
	action,
	//
	ui,
	...props
}) => {
	return (
		<Container
			data-ui={"LabelValue[Container]"}
			ui={{
				tone: "neutral",
				theme: "light",
				inner: "default",
				round: "default",
				background: "default",
				flow: "vertical",
				gap: "xs",
				border: true,
				shadow: true,
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"LabelValue-[Container.label-wrapper]"}
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
						text: "default",
						truncate: true,
					}}
					{...textValueProps}
				/>
			) : (
				textValue
			)}

			{textHint ? (
				<Tx
					label={textHint}
					ui={{
						tone: "neutral",
						theme: "light",
						text: "xs",
						color: "icon",
						italic: true,
					}}
				/>
			) : null}
		</Container>
	);
};
