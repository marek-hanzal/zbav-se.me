import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { FC } from "react";

export namespace EmptyStatus {
	export interface Props
		extends Container.Props,
			Pick<Status.Props, "icon" | "textTitle" | "textMessage" | "action"> {
		//
	}
}

export const EmptyStatus: FC<EmptyStatus.Props> = ({
	action,
	icon,
	textMessage,
	textTitle,
	ui,
	...props
}) => {
	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				icon={icon}
				textTitle={textTitle}
				textMessage={textMessage}
				action={action}
				ui={{
					tone: "brand",
					theme: "light",
					color: "lead",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};
