import type { ComponentProps, FC, ReactNode } from "react";
import { Mx } from "~/translation/ui/Mx";
import { Tx } from "~/translation/ui/Tx";
import { uiStatusFn } from "~/ui/fn/uiStatusFn";
import { Container } from "~/ui/ui/Container";
import { Icon } from "~/ui/ui/Icon";
import type { Typo } from "~/ui/ui/Typo";

export namespace Status {
	export interface Props extends uiStatusFn.Component<ComponentProps<"div">> {
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
			{...uiStatusFn({
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
