import { type Cls, tvc } from "@use-pico/cls";
import { isString } from "@use-pico/common/is-string";
import type { FC, ReactNode } from "react";
import { Tx } from "../tx/Tx";
import { Badge } from "./Badge";
import type { BadgeCls } from "./BadgeCls";

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

const defaultTweak: Cls.TweaksOf<BadgeCls> = {
	slot: {
		root: {
			class: [
				"flex",
				"flex-col",
				"items-start",
				"h-fit",
				"w-full",
				"border-none",
				"gap-2",
				"px-4",
				"py-3",
			],
			token: [
				"round.default",
			],
		},
	},
};

export const BadgeValue: FC<BadgeValue.Props> = ({
	textLabel,
	textValue,
	textValueProps,
	action,
	tweak,
	//
	...props
}) => {
	return (
		<Badge
			ui={"BadgeValue-root"}
			tone={"neutral"}
			tweak={[
				defaultTweak,
				tweak,
			]}
			{...props}
		>
			<div
				className={tvc([
					"flex",
					"flex-row",
					"items-center",
					"justify-between",
					"w-full",
				])}
			>
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
