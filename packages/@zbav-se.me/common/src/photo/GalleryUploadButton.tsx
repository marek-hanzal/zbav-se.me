import { Button } from "@use-pico/client/ui/button";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { GallerySheet } from "./GallerySheet";

export namespace GalleryUploadButton {
	export interface Props<TData extends GallerySheet.Uploads>
		extends Button.Props,
			Pick<
				GallerySheet.Props<TData>,
				"withMutation" | "toMutation" | "onSuccess" | "onCancel" | "state"
			> {
		//
	}
}

export const GalleryUploadButton = <TData extends GallerySheet.Uploads>({
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
				{...props}
			/>

			<GallerySheet
				withMutation={withMutation}
				toMutation={toMutation}
				onSuccess={onSuccess}
				onCancel={onCancel}
				state={state}
			/>
		</>
	);
};
