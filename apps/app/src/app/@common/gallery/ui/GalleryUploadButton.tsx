import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import { PhotoIcon } from "@zbav-se.me/ui/icon";
import { GalleryUploadSheet } from "~/app/@common/gallery/ui/GalleryUploadSheet";

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

/**
 * Renders a single action button that toggles the gallery upload sheet and wires upload callbacks through.
 * Use it in editors where photo upload should start from a clear CTA while keeping upload flow encapsulated.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/patch/GalleryPatch.tsx
 */
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
				onClick={() => state.set((prev) => !prev)}
				ui={{
					tone: "primary",
					theme: "light",
					size: "xl",
					justify: "start",
					...ui,
				}}
				{...props}
			>
				<Tx label="Upload photos (button)" />
			</Button>

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
