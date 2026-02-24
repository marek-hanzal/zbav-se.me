import { SpinnerIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Progress } from "@use-pico/client/ui/progress";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace PhotoUploadPending {
	export interface Props {
		progress: number;
	}
}

export const PhotoUploadPending: FC<PhotoUploadPending.Props> = ({ progress }) => {
	return (
		<Container
			data-ui={"PhotoUpload-[Container.spinner]"}
			ui={{
				flow: "vertical",
				height: "full",
				items: "center",
				justify: "center",
			}}
		>
			<Status
				data-ui={"PhotoUpload-[Status.spinner]"}
				icon={SpinnerIcon}
				textTitle={translator.text("Uploading photo (title)")}
				action={
					<Progress
						value={progress * 100}
						size={"lg"}
						tone={"primary"}
						theme={"dark"}
					/>
				}
				ui={{
					tone: "primary",
					theme: "light",
				}}
			/>
		</Container>
	);
};
