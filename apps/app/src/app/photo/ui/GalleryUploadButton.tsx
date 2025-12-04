import { Button } from "@use-pico/client/ui/button";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { GalleryUploadSheet } from "./GalleryUploadSheet";

export namespace GalleryUploadButton {
	export interface Props<TData extends GalleryUploadSheet.Uploads>
		extends Button.Props,
			Pick<
				GalleryUploadSheet.Props<TData>,
				"withMutation" | "toMutation" | "onSuccess" | "onCancel" | "state"
			> {
		//
	}
}

export const GalleryUploadButton = <TData extends GalleryUploadSheet.Uploads>({
	withMutation,
	toMutation,
	onSuccess,
	onCancel,
	state,
	...props
}: GalleryUploadButton.Props<TData>) => {
	return (
		<>
			<Button
				iconEnabled={PhotoIcon}
				tone={"primary"}
				theme={"light"}
				label={"Upload photos (button)"}
				size={"xl"}
				onClick={() => state.set((prev) => !prev)}
				menu
				{...props}
			/>

			<GalleryUploadSheet
				withMutation={withMutation}
				toMutation={toMutation}
				onSuccess={onSuccess}
				onCancel={onCancel}
				state={state}
			/>
		</>
	);
};
