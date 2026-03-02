import type { ComponentProps, FC } from "react";
import { Icon } from "../../icon/Icon";
import { SpinnerIcon } from "../../icon/SpinnerIcon";
import { uiButton } from "./uiButton";

export namespace Button {
	export interface Props extends uiButton.Component<ComponentProps<"button">> {
		/**
		 * Icon to display when the button is enabled and not loading.
		 */
		iconEnabled?: Icon.Type;
		/**
		 * Icon to display when the button is disabled.
		 * Falls back to `iconEnabled` if not provided.
		 */
		iconDisabled?: Icon.Type;
		/**
		 * Icon to display when the button is loading.
		 * @default SpinnerIcon
		 */
		iconLoading?: Icon.Type;
		/**
		 * Additional props to pass to the icon component.
		 */
		iconProps?: Omit<Icon.Props, "icon">;
		/**
		 * Position of the icon relative to the label.
		 * @default "left"
		 */
		iconPosition?: "left" | "right";
		/**
		 * Whether the button is in a loading state.
		 * When true, shows the loading icon and prevents interaction.
		 */
		loading?: boolean;
		/**
		 * Whether to truncate text that overflows the button width.
		 * @default false
		 */
		truncate?: boolean;
	}
}

export const Button: FC<Button.Props> = ({
	iconEnabled,
	iconDisabled,
	iconLoading = SpinnerIcon,
	iconProps,
	iconPosition = "left",
	loading,
	disabled,
	//
	truncate,
	children,
	//
	ui,
	className,
	//
	...props
}) => {
	const getIcon = () => {
		if (loading === true) {
			return iconLoading;
		}
		if (disabled) {
			return iconDisabled ?? iconEnabled;
		}
		return iconEnabled;
	};

	const icon = getIcon();

	return (
		<button
			type={"button"}
			disabled={disabled}
			//
			{...uiButton({
				ui: {
					disabled,
					...ui,
				},
				className,
			})}
			{...props}
		>
			{iconPosition === "left" && icon ? (
				<Icon
					data-ui={"Button-[Icon]"}
					icon={icon}
					{...iconProps}
				/>
			) : null}

			{children}

			{iconPosition === "right" && icon ? (
				<Icon
					data-ui={"Button-[Icon]"}
					icon={icon}
					{...iconProps}
				/>
			) : null}
		</button>
	);
};
