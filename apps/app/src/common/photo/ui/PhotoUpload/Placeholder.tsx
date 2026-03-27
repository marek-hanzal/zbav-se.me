import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
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
			ui={{
				flow: "vertical",
				height: "full",
				items: "center",
				justify: "center",
				round: "default",
			}}
		>
			<Status
				data-ui={"PhotoUpload-[Status.placeholder]"}
				icon={PhotoIcon}
				textTitle={translator.text("Photo upload placeholder (title)")}
				textMessage={translator.text("Photo upload placeholder (message)")}
				ui={{
					tone: disabled ? "neutral" : "primary",
					theme: "light",
					inner: "4xl",
				}}
				className={"text-center"}
			/>
		</Container>
	);
};
