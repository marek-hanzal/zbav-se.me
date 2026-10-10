import type { FC } from "react";
import { uiWarningStatusFn } from "~/application-ui/fn/ui.exports";
import { Mx } from "~/translation/ui/Mx";
import { WarningIcon } from "~/ui/constant/WarningIcon";
import type { uiContainerFn } from "~/ui/fn/uiContainerFn";
import { Container } from "~/ui/ui/Container";
import type { Status as StatusUi } from "~/ui/ui/Status";
import { Status } from "~/ui/ui/Status";

export namespace Default {
	export interface Props extends uiContainerFn.Props {
		textHint: string;
		warningStatusProps?: StatusUi.Props;
	}
}

export const Default: FC<Default.Props> = ({ textHint, warningStatusProps, ...props }) => {
	return (
		<Container
			data-ui="ListContainer[Container.default]"
			data-ui-layout="vertical-centered"
			data-ui-scroll="vertical"
			data-ui-height="full"
			{...props}
		>
			<Status
				icon={WarningIcon}
				{...uiWarningStatusFn({})}
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
