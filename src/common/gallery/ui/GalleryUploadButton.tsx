import { Button } from "@/lib/client/button";
import { Tx } from "@/lib/client/tx";
import { GalleryUploadSheet } from "~/common/gallery/ui/GalleryUploadSheet";
import { PhotoIcon } from "~/common/ui/icon";

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
 * @see src/draft/ui/DraftEditor/patch/GalleryPatch.tsx
 */
export const GalleryUploadButton = <TData extends GalleryUploadSheet.Uploads>({
	withMutation,
	toMutation,
	onSuccess,
	onCancel,
	state,
	defaultUploadIds,
	...props
}: GalleryUploadButton.Props<TData>) => {
	return (
		<>
			<Button
				iconEnabled={PhotoIcon}
				onClick={() => state.set((prev) => !prev)}
				data-ui-tone="primary"
				data-ui-theme="light"
				data-ui-size="xl"
				data-ui-justify="start"
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
				detent={"default"}
			/>
		</>
	);
};
