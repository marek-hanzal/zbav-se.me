import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import { uiWarningStatus } from "@zbav-se.me/ui/ui";
import type { FC } from "react";

export namespace Empty {
	export interface Props extends Container.Props {
		//
	}
}

export const Empty: FC<Empty.Props> = ({ ui, ...props }) => {
	return (
		<Container
			data-ui="ListContainer[Container.empty]"
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				icon={SearchIcon}
				textTitle={translator.text("No categories found (title)")}
				textMessage={translator.text("No categories found (message)")}
				{...uiWarningStatus({
					className: [],
				})}
				data-ui="ListContainer-[Status.empty]"
			/>
		</Container>
	);
};
