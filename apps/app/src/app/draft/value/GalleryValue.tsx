import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import type { tDraft } from "@zbav-se.me/sdk/api/user";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";

export namespace GalleryValue {
	export interface Props extends Container.Props {
		draft: tDraft;
	}
}

export const GalleryValue: FC<GalleryValue.Props> = ({ draft, ...props }) => {
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
			{draft.gallery.items.length > 0 && draft.gallery.items[0]?.upload ? (
				<HeroImage
					src={draft.gallery.items[0]?.upload.url}
					ui={{
						round: "default",
					}}
				/>
			) : null}

			{draft.gallery.items.length > 0 ? null : (
				<Status
					data-ui={"GalleryValue-[Status.photo-hint]"}
					icon={PhotoIcon}
					iconProps={{
						ui: {
							text: "3xl",
						},
					}}
					textTitle={"Listing photo gallery (label)"}
					titleProps={{
						ui: {
							font: "normal",
							text: "lg",
						},
					}}
					ui={{
						tone: (draft.gallery?.items.length ?? 0) > 0 ? "neutral" : "primary",
						theme: "light",
						text: "default",
					}}
				/>
			)}
		</Container>
	);
};
