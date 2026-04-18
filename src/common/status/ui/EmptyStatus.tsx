import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";

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
	...props
}) => {
	return (
		<Container
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			{...props}
		>
			<Status
				icon={icon}
				textTitle={textTitle}
				textMessage={textMessage}
				action={action}
				data-ui-tone="brand"
				data-ui-theme="light"
				data-ui-color="lead"
				data-ui-inner="4xl"
				className={"text-center"}
			/>
		</Container>
	);
};
