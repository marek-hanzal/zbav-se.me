import { isString } from "@use-pico/common/is-string";
import type { FC, ReactNode } from "react";
import { Tx } from "../tx/Tx";
import { Badge } from "./Badge";

/**
 * Badge component with label and value display.
 *
 * @group ui
 */
export namespace BadgeValue {
	export interface Props extends Badge.Props {
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
}

export const BadgeValue: FC<BadgeValue.Props> = ({
	textLabel,
	textValue,
	textValueProps,
	action,
	//
	ui,
	className,
	...props
}) => {
	return (
		<Badge
			data-ui={"BadgeValue"}
			ui={{
				tone: "neutral",
				...ui,
			}}
			className={[
				"BadgeValue",
				className,
			]}
			{...props}
		>
			<div data-ui="BadgeValue-label-wrapper">
				<Tx
					label={textLabel}
					tone={"primary"}
					preset={"label"}
					size={"md"}
				/>

				{action}
			</div>

			{isString(textValue) ? (
				<Tx
					label={textValue}
					truncate
					tone={"secondary"}
					size={"md"}
					{...textValueProps}
				/>
			) : (
				textValue
			)}
		</Badge>
	);
};
