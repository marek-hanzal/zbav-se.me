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
		defaultUploadIds: string[];
	}
}

export const GalleryUploadButton = <TData extends GalleryUploadSheet.Uploads>({
	withMutation,
	toMutation,
	onSuccess,
	onCancel,
	state,
	defaultUploadIds,
	ui,
	...props
}: GalleryUploadButton.Props<TData>) => {
	return (
		<>
			<Button
				iconEnabled={PhotoIcon}
				label={"Upload photos (button)"}
				onClick={() => state.set((prev) => !prev)}
				ui={{
					tone: "primary",
					theme: "light",
					size: "xl",
					justify: "start",
					...ui,
				}}
				{...props}
			/>

			<GalleryUploadSheet
				withMutation={withMutation}
				toMutation={toMutation}
				onSuccess={onSuccess}
				onCancel={onCancel}
				state={state}
				defaultUploadIds={defaultUploadIds}
			/>
		</>
	);
};
