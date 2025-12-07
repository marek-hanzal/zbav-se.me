import type { ComponentProps, FC, ReactNode } from "react";
import { Icon } from "../../icon/Icon";
import type { UiProps } from "../../type/UiProps";
import { Tx } from "../tx/Tx";
import type { Typo } from "../typo/Typo";

export namespace Status {
	export interface Props extends UiProps<ComponentProps<"div">> {
		/**
		 * Translation key for the title text.
		 */
		textTitle?: string;
		/**
		 * Translation key for the message text.
		 */
		textMessage?: string;
		/**
		 * Optional action section (e.g., buttons)
		 */
		action?: ReactNode;
		icon?: Icon.Type;
		iconProps?: Icon.PropsEx;
		titleProps?: Typo.PropsEx;
		messageProps?: Typo.PropsEx;
		tone?: Icon.Tone;
		theme?: Icon.Theme;
	}
}

export const Status: FC<Status.Props> = ({
	ref,
	ui,
	textTitle,
	textMessage,
	action,
	icon,
	iconProps,
	titleProps,
	messageProps,
	tone,
	theme,
	children,
	...props
}) => {
	return (
		<div
			ref={ref}
			data-root="Status-root"
			data-ui={ui ?? "Status-root"}
			//
			data-tone={tone}
			data-theme={theme}
			//
			{...props}
		>
			<div data-ui="Status-title">
				<Icon
					icon={icon}
					size="xl"
					className="opacity-50"
					{...iconProps}
				/>

				<Tx
					label={textTitle}
					size="xl"
					font="bold"
					display="block"
					wrap={"wrap"}
					{...titleProps}
				/>
				<Tx
					label={textMessage}
					display="block"
					wrap={"wrap"}
					{...messageProps}
				/>
			</div>

			{action && <div data-ui="Status-action">{action}</div>}

			{children ? <div data-ui="Status-body">{children}</div> : null}
		</div>
	);
};
