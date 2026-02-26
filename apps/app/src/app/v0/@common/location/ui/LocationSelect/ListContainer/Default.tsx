import { WarningIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { uiWarningStatus } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import type { ListContainer } from "./ListContainer";

export namespace Default {
	export interface Props extends Pick<ListContainer.Props, "textHint" | "warningStatusProps" | "ui"> {
		//
	}
}

export const Default: FC<Default.Props> = ({ textHint, warningStatusProps, ui }) => {
	return (
		<Container
			data-ui="ListContainer[Container.default]"
			ui={{
				layout: "vertical-centered",
				scroll: "vertical",
				height: "full",
				...ui,
			}}
		>
			<Status
				icon={WarningIcon}
				{...uiWarningStatus({
					className: [],
				})}
				{...warningStatusProps}
			>
				<Container
					ui={{
						text: "default",
					}}
				>
					<Mx
						label={textHint}
						ui={{
							tone: "secondary",
							theme: "light",
						}}
					/>
				</Container>
			</Status>
		</Container>
	);
};
