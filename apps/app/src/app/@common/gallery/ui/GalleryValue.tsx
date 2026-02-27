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

/**
 * Displays a read-only gallery value with hero-image preview and a fallback status when no photos are present.
 * Use it in summaries and detail cards where users need a quick visual check of current gallery state.
 *
 * @see apps/app/src/app/@seller-user/draft/ui/DraftEditor/patch/GalleryPatch.tsx
 */
export const GalleryValue: FC<GalleryValue.Props> = ({
	uploads,
	label,
	statusProps,
	ui,
	...props
}) => {
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
				...ui,
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
