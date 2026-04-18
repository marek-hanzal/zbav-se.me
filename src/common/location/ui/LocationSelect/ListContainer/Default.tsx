import type { FC } from "react";
import type { Container as ContainerUi } from "@/lib/client/container";
import { Container } from "@/lib/client/container";
import { WarningIcon } from "@/lib/client/icon";
import { Mx } from "@/lib/client/mx";
import type { Status as StatusUi } from "@/lib/client/status";
import { Status } from "@/lib/client/status";
import { uiWarningStatus } from "~/common/ui/ui";

export namespace Default {
	export interface Props extends Pick<ContainerUi.Props, "ui"> {
		textHint: string;
		warningStatusProps?: StatusUi.Props;
	}
}

export const Default: FC<Default.Props> = ({ textHint, warningStatusProps }) => {
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
				<Container data-ui-text="default">
					<Mx
						label={textHint}
						data-ui-tone="secondary"
						data-ui-theme="light"
					/>
				</Container>
			</Status>
		</Container>
	);
};
