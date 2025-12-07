import type { ComponentProps, FC } from "react";
import { CheckIcon } from "../../icon/CheckIcon";
import { Icon } from "../../icon/Icon";
import { UnCheckIcon } from "../../icon/UnCheckIcon";
import { UndefinedIcon } from "../../icon/UndefinedIcon";
import type { UiProps } from "../../type/UiProps";

/**
 * Renders icon based on a boolean value.
 *
 * @group ui
 *
 * @example
 * ```tsx
 * import {BoolInline} from "@use-pico/client";
 *
 * export const MyComponent = () => {
 *  return <BoolInline
 *    bool={true}
 *  />
 * }
 * ```
 */
export namespace BoolInline {
	/**
	 * Props for BoolInline component.
	 */
	export interface Props extends UiProps<ComponentProps<"div">> {
		/**
		 * Input boolean value.
		 */
		value?: boolean | null;
		/**
		 * Icon to display when value is true.
		 */
		checkIcon?: string;
		/**
		 * Icon to display when value is false.
		 */
		unCheckIcon?: string;
		/**
		 * Icon to display when value is undefined.
		 */
		undefinedIcon?: string;
		iconProps?: Icon.PropsEx;
	}
}

export const BoolInline: FC<BoolInline.Props> = ({
	ui,
	value,
	checkIcon = CheckIcon,
	unCheckIcon = UnCheckIcon,
	undefinedIcon = UndefinedIcon,
	iconProps,
	...props
}) => {
	if (value === null || value === undefined) {
		return (
			<div
				data-root="BoolInline-root"
				data-ui={ui ?? "BoolInline-root"}
				//
				data-value="unknown"
				//
				{...props}
			>
				<Icon
					icon={undefinedIcon}
					{...iconProps}
				/>
			</div>
		);
	}

	return (
		<div
			data-root="BoolInline-root"
			data-ui={ui ?? "BoolInline-root"}
			//
			data-value={value}
			//
			{...props}
		>
			<Icon
				icon={value ? checkIcon : unCheckIcon}
				{...iconProps}
			/>
		</div>
	);
};
