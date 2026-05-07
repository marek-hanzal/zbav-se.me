import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";
import { translator } from "@/lib/common/translation";
import { PhotoIcon } from "~/common/ui/icon";

export namespace Placeholder {
	export interface Props {
		disabled?: boolean;
	}
}

export const Placeholder: FC<Placeholder.Props> = ({ disabled }) => {
	return (
		<Container
			data-ui={"PhotoUpload-[Container.placeholder]"}
			data-ui-flow="vertical"
			data-ui-height="full"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-round="default"
		>
			<Status
				data-ui={"PhotoUpload-[Status.placeholder]"}
				icon={PhotoIcon}
				textTitle={translator.text("Photo upload placeholder (title)")}
				textMessage={translator.text("Photo upload placeholder (message)")}
				data-ui-tone={disabled ? "neutral" : "primary"}
				data-ui-theme="light"
				data-ui-inner="4xl"
				className={"text-center"}
			/>
		</Container>
	);
};
