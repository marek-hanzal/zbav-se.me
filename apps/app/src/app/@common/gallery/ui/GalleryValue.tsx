import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";

export namespace GalleryValue {
	export interface Props extends Container.Props {
		uploads: tUpload[];
		label: string;
		statusProps?: Status.Props;
	}
}

export const GalleryValue: FC<GalleryValue.Props> = ({ uploads, label, statusProps, ...props }) => {
	return (
		<Container
			data-ui={"GalleryValue[Container]"}
			ui={{
				tone: "neutral",
				theme: "light",
				round: "md",
				width: "full",
				flow: "horizontal",
				items: "center",
				justify: "center",
				background: "default",
				shadow: true,
				border: true,
			}}
			className="h-42"
			{...props}
		>
			{uploads.length > 0 && uploads[0] ? (
				<HeroImage
					src={uploads[0].url}
					ui={{
						round: "default",
					}}
				/>
			) : null}

			{uploads.length > 0 ? null : (
				<Status
					data-ui={"GalleryValue-[Status.photo-hint]"}
					icon={PhotoIcon}
					iconProps={{
						ui: {
							text: "3xl",
						},
					}}
					textTitle={label}
					titleProps={{
						ui: {
							font: "normal",
							text: "lg",
						},
					}}
					ui={{
						tone: uploads.length > 0 ? "neutral" : "primary",
						theme: "light",
						text: "default",
					}}
					{...statusProps}
				/>
			)}
		</Container>
	);
};
