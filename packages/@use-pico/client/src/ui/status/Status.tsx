import type { ComponentProps, FC, ReactNode } from "react";
import { Icon } from "../../icon/Icon";
import { Tx } from "../tx/Tx";
import type { Typo } from "../typo/Typo";

export namespace Status {
	export interface Props extends ComponentProps<"div"> {
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
			data-root="Status"
			//
			data-tone={tone}
			data-theme={theme}
			//
			{...props}
		>
			<div data-ui="Status-title-wrapper">
				<Icon
					data-ui="Status-icon"
					icon={icon}
					size="xl"
					{...iconProps}
				/>

				<Tx
					data-ui="Status-title"
					label={textTitle}
					size="xl"
					font="bold"
					display="block"
					wrap={"wrap"}
					{...titleProps}
				/>
				<Tx
					data-ui="Status-message"
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
