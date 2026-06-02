import type { ComponentProps, FC, ReactNode } from "react";
import { Container } from "../container/Container";
import { Icon } from "../icon/Icon";
import { Mx } from "../mx/Mx";
import { Tx } from "../tx/Tx";
import type { Typo } from "../typo/Typo";
import { uiStatus } from "./uiStatus";

export namespace Status {
	export interface Props extends uiStatus.Component<ComponentProps<"div">> {
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
		messageProps?: Mx.PropsEx;
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
	className,
	//
	children,
	...props
}) => {
	return (
		<div
			{...uiStatus({
				className,
			})}
			{...props}
		>
			<Container
				data-ui-layout="vertical-flex"
				data-ui-items="center"
				data-ui-width="full"
				data-ui-gap="lg"
			>
				<Icon
					icon={icon}
					{...iconProps}
				/>

				<Container
					data-ui-layout="vertical-flex"
					data-ui-items="center"
					data-ui-width="full"
				>
					<Tx
						label={textTitle}
						data-ui-font="semibold"
						data-ui-display="block"
						data-ui-wrap="wrap"
						data-ui-text="lg"
						{...titleProps}
					/>

					<Mx
						label={textMessage}
						{...messageProps}
					/>
				</Container>
			</Container>

			{action && (
				<Container
					data-ui-layout="vertical-flex"
					data-ui-items="center"
					data-ui-justify="center"
					data-ui-gap="default"
				>
					{action}
				</Container>
			)}

			{children}
		</div>
	);
};
