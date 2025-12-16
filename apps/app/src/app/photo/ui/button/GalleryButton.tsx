import { Button } from "@use-pico/client/ui/button";
import type { tUpload } from "@zbav-se.me/sdk/api/user";
import { GalleryIcon } from "@zbav-se.me/ui/icon";
import { type FC, useState } from "react";
import { GallerySheet } from "~/app/photo/ui/GallerySheet";

export namespace GalleryButton {
	export interface Props extends Button.Props {
		uploads: tUpload[];
	}
}

export const GalleryButton: FC<GalleryButton.Props> = ({ uploads, ui, ...props }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Button
				iconEnabled={GalleryIcon}
				onClick={() => setIsOpen((prev) => !prev)}
				label={"Open gallery (button)"}
				ui={{
					tone: "primary",
					theme: "light",
					justify: "start",
					size: "xl",
					...ui,
				}}
				{...props}
			/>

			<GallerySheet
				uploads={uploads}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
			/>
		</>
	);
};
