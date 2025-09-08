import { type Cls, useCls } from "@use-pico/cls";
import type { ButtonHTMLAttributes, FC } from "react";
import { Icon } from "../icon/Icon";
import { SpinnerIcon } from "../icon/SpinnerIcon";
import { ButtonCls } from "./ButtonCls";

export namespace Button {
	export interface Props
		extends ButtonCls.Props<ButtonHTMLAttributes<HTMLButtonElement>> {
		iconEnabled?: string;
		iconDisabled?: string;
		iconLoading?: string;
		iconProps?: Omit<Icon.Props, "icon">;
		loading?: boolean;
		size?: Cls.VariantOf<ButtonCls, "size">;
		tone?: Cls.VariantOf<ButtonCls, "tone">;
		theme?: Cls.VariantOf<ButtonCls, "theme">;
	}
}

export const Button: FC<Button.Props> = ({
	iconEnabled,
	iconDisabled,
	iconLoading = SpinnerIcon,
	iconProps,
	loading,
	size,
	tone,
	theme,
	cls = ButtonCls,
	tweak,
	children,
	...props
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			disabled: props.disabled,
			size,
			tone,
			theme,
		}),
	}));

	return (
		<div className={slots.wrapper()}>
			<button
				className={slots.root()}
				type={"button"}
				{...props}
			>
				{props.disabled ? (
					<Icon
						icon={loading === true ? iconLoading : iconDisabled}
						size={"sm"}
						{...iconProps}
					/>
				) : (
					<Icon
						icon={loading === true ? iconLoading : iconEnabled}
						size={"sm"}
						{...iconProps}
					/>
				)}
				{children}
			</button>
		</div>
	);
};
