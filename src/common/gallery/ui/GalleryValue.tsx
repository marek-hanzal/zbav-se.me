import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { Status } from "@/lib/client/status";
import { PhotoIcon } from "~/common/ui/icon";
import { HeroImage } from "~/common/ui/img";
import type { UploadSchema } from "~/user/upload/server/schema/UploadSchema";

export namespace GalleryValue {
	export interface Props extends Container.Props {
		uploads: UploadSchema.Type[];
		label: string;
		statusProps?: Status.Props;
	}
}

/**
 * Displays a read-only gallery value with hero-image preview and a fallback status when no photos are present.
 * Use it in summaries and detail cards where users need a quick visual check of current gallery state.
 *
 * @see src/draft/ui/DraftEditor/patch/GalleryPatch.tsx
 */
export const GalleryValue: FC<GalleryValue.Props> = ({ uploads, label, statusProps, ...props }) => {
	return (
		<Container
			data-ui={"GalleryValue[Container]"}
			ui={{
				tone: "neutral",
				theme: "light",
				round: undefined,
				width: "full",
				flow: "horizontal",
				items: "center",
				justify: "center",
				background: "default",
				shadow: false,
				border: false,
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
						tone: "neutral",
						theme: "light",
						text: "default",
					}}
					{...statusProps}
				/>
			)}
		</Container>
	);
};
