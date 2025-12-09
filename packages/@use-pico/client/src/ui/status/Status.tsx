import type { ComponentProps, FC, ReactNode } from "react";
import { Icon } from "../../icon/Icon";
import { Tx } from "../tx/Tx";
import type { Typo } from "../typo/Typo";
import { asStatus } from "./asStatus";

export namespace Status {
	export interface Props extends asStatus.PropsEx<ComponentProps<"div">> {
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
	//
	tone,
	theme,
	//
	className,
	//
	children,
	...props
}) => {
	return (
		<div
			{...asStatus({
				tone,
				theme,
				//
				className,
			})}
			//
			{...props}
		>
			<div data-ui="Status-title-wrapper">
				<Icon
					data-ui="Status-icon"
					icon={icon}
					ui={{
						size: "xl",
					}}
					{...iconProps}
				/>

				<Tx
					data-ui="Status-title"
					label={textTitle}
					ui={{
						font: "bold",
						display: "block",
						wrap: "wrap",
					}}
					{...titleProps}
				/>
				<Tx
					data-ui="Status-message"
					label={textMessage}
					ui={{
						display: "block",
						wrap: "wrap",
					}}
					{...messageProps}
				/>
			</div>

			{action && <div data-ui="Status-action">{action}</div>}

			{children ? <div data-ui="Status-body">{children}</div> : null}
		</div>
	);
};
